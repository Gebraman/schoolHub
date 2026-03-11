// server/services/emailVerification.js
const axios = require("axios");

class EmailVerificationService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = "https://api.mailsniperapp.com/v1";
  }

  /**
   * Verify an email address using MailSniper API
   */
  async verifyEmail(email) {
    try {
      console.log(`🔍 Calling MailSniper API for: ${email}`);

      const response = await axios.get(
        `${this.baseUrl}/verify/email/${encodeURIComponent(email)}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
          timeout: 10000,
        },
      );

      const data = response.data;

      // Track credits remaining
      const creditsRemaining = response.headers["x-ratelimit-remaining"]
        ? parseInt(response.headers["x-ratelimit-remaining"])
        : null;

      if (creditsRemaining !== null) {
        console.log(`📊 Credits remaining: ${creditsRemaining}`);
      }

      return {
        success: true,
        email: data.email,
        isValid: data.is_valid,
        isDisposable: data.is_disposable || false,
        isSpam: data.is_spam || false,
        isPublicProvider: data.is_public_provider || false,
        isUniversity: data.is_university || false,
        risk: data.risk || 0,
        domain: data.domain,
        dns: data.dns,
        creditsRemaining,
        raw: data,
      };
    } catch (error) {
      console.error("❌ MailSniper API error:", error.message);

      // Handle specific error types
      if (error.response) {
        const status = error.response.status;

        if (status === 401) {
          return {
            success: false,
            error: "invalid_api_key",
            message: "Invalid MailSniper API key",
          };
        }

        if (status === 429) {
          return {
            success: false,
            error: "quota_exceeded",
            message: "MailSniper quota exceeded",
          };
        }
      }

      // Fail open - allow registration if API is down
      return {
        success: true,
        isValid: true,
        isDisposable: false,
        isSpam: false,
        risk: 0,
        warning: "Email verification temporarily unavailable",
      };
    }
  }

  /**
   * Make registration decision based on verification
   */
  shouldAllowRegistration(verification) {
    // If verification failed (API down), allow registration
    if (verification.warning) {
      return {
        allowed: true,
        reasons: ["Proceeding without verification (service unavailable)"],
      };
    }

    const reasons = [];

    if (!verification.isValid) {
      reasons.push("Email address is invalid");
    }

    if (verification.isDisposable) {
      reasons.push("Disposable email addresses are not allowed");
    }

    if (verification.isSpam) {
      reasons.push("This email domain is associated with spam");
    }

    if (verification.risk >= 70) {
      reasons.push("Email has high risk score");
    }

    if (reasons.length > 0) {
      return {
        allowed: false,
        reasons: reasons,
      };
    }

    return {
      allowed: true,
      reasons: ["Email verification passed"],
    };
  }

  /**
   * Check remaining API credits
   */
  async checkUsage() {
    try {
      const response = await axios.get(`${this.baseUrl}/usage`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });

      return {
        total: response.data.total,
        used: response.data.used,
        remaining: response.data.remaining,
        percentageUsed: (
          (response.data.used / response.data.total) *
          100
        ).toFixed(2),
        isLow: response.data.remaining < 1000,
        isCritical: response.data.remaining < 100,
      };
    } catch (error) {
      console.error("Failed to check usage:", error.message);
      return null;
    }
  }
}

module.exports = EmailVerificationService;
