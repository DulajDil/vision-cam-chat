# Security Policy

## Supported Versions

Currently supported version:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability, please follow these steps:

1. **Do Not** open a public issue
2. Email security details to: [your-email@example.com]
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

## Security Considerations

### API Keys

- OpenAI API keys are transmitted via HTTPS headers only
- Keys are never logged or persisted
- Users maintain control of their own keys
- Consider implementing API key encryption at rest

### Image Handling

- Images stored in memory only by default
- No disk persistence
- Automatic cleanup on new upload
- 10MB file size limit enforced
- Consider implementing virus scanning for production

### Authentication

Currently, the application does not implement user authentication. For production deployment:

- Implement user authentication
- Rate limiting per user/IP
- Session management
- CSRF protection

### CORS

- Configure specific origins for production
- Avoid wildcard CORS in production
- Implement proper preflight handling

### Input Validation

- All user inputs are validated
- File type checking implemented
- Size limits enforced
- Consider additional sanitization

### Dependencies

- Regular dependency updates recommended
- Automated security scanning via GitHub Dependabot
- Review CVEs for critical dependencies

## Best Practices for Deployment

1. Use HTTPS for all traffic
2. Implement rate limiting
3. Enable security headers (use helmet.js)
4. Regular security audits
5. Monitor for suspicious activity
6. Keep dependencies updated
7. Use environment variables for sensitive data
8. Implement proper logging and monitoring

## Response Timeline

- Acknowledgment: Within 48 hours
- Initial assessment: Within 7 days
- Fix timeline: Depends on severity
  - Critical: Immediate
  - High: Within 7 days
  - Medium: Within 30 days
  - Low: Next release cycle

Thank you for helping keep Vision Cam Chat secure!

