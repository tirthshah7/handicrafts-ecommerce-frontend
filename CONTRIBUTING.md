# Contributing to Handicrafts E-commerce

Thank you for your interest in contributing to our e-commerce platform! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- Basic knowledge of React, TypeScript, and Tailwind CSS

### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/handicrafts-ecommerce-frontend.git
   cd handicrafts-ecommerce-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## 📋 Development Guidelines

### Code Style

- **TypeScript**: Use TypeScript for all new code
- **ESLint**: Follow the configured ESLint rules
- **Prettier**: Code formatting is handled by Prettier
- **Naming**: Use descriptive names for variables, functions, and components

### Component Guidelines

- **Functional Components**: Use React functional components with hooks
- **Props Interface**: Define TypeScript interfaces for all props
- **Default Props**: Use default parameters instead of defaultProps
- **Component Structure**: Follow the established component structure

### File Organization

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── [feature]/       # Feature-specific components
│   └── [page].tsx       # Page components
├── services/            # Business logic
├── utils/               # Utility functions
├── types/               # TypeScript type definitions
└── hooks/               # Custom React hooks
```

### Styling Guidelines

- **Tailwind CSS**: Use Tailwind utility classes
- **Component Styling**: Prefer component-level styling
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Support both light and dark themes

## 🔄 Git Workflow

### Branch Naming

- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `hotfix/description` - Critical fixes
- `refactor/description` - Code refactoring
- `docs/description` - Documentation updates

### Commit Messages

Follow the conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(payment): add Razorpay integration
fix(cart): resolve item quantity update issue
docs(readme): update installation instructions
```

### Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, well-documented code
   - Add tests if applicable
   - Update documentation if needed

3. **Test your changes**
   ```bash
   npm run build
   npm run lint
   npm run type-check
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat(feature): add your feature description"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**
   - Use the PR template
   - Provide clear description
   - Link related issues
   - Request reviews from maintainers

## 🧪 Testing

### Testing Guidelines

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete user workflows
- **Manual Testing**: Test on different devices and browsers

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Description**: Clear description of the issue
2. **Steps to Reproduce**: Detailed steps to reproduce the bug
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**: Browser, OS, device information
6. **Screenshots**: If applicable
7. **Console Logs**: Any error messages

## 💡 Feature Requests

When requesting features, please include:

1. **Use Case**: Why is this feature needed?
2. **Description**: Detailed description of the feature
3. **Acceptance Criteria**: What constitutes a successful implementation
4. **Mockups/Wireframes**: Visual representations if applicable
5. **Priority**: How important is this feature?

## 📚 Documentation

### Documentation Guidelines

- **README**: Keep the main README updated
- **Code Comments**: Comment complex logic
- **API Documentation**: Document API endpoints
- **Component Documentation**: Document component props and usage

### Documentation Types

- **User Documentation**: How to use the application
- **Developer Documentation**: How to contribute and develop
- **API Documentation**: Backend API reference
- **Deployment Documentation**: How to deploy the application

## 🔒 Security

### Security Guidelines

- **Never commit secrets**: Use environment variables
- **Input Validation**: Validate all user inputs
- **Authentication**: Implement proper authentication
- **Authorization**: Implement proper authorization
- **HTTPS**: Use HTTPS in production
- **Dependencies**: Keep dependencies updated

### Reporting Security Issues

If you discover a security vulnerability, please:

1. **Do not** create a public issue
2. Email security@handicrafts-ecommerce.com
3. Include detailed information about the vulnerability
4. Allow time for the issue to be addressed before public disclosure

## 🏷️ Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

- [ ] All tests pass
- [ ] Documentation updated
- [ ] Changelog updated
- [ ] Version bumped
- [ ] Release notes prepared
- [ ] Deployment tested

## 🤝 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors.

### Expected Behavior

- Be respectful and inclusive
- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment, discrimination, or inappropriate comments
- Personal attacks or political discussions
- Spam or excessive self-promotion
- Any other unprofessional conduct

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For general questions and discussions
- **Email**: For security issues or private matters
- **Documentation**: Check the README and docs first

## 🙏 Recognition

Contributors will be recognized in:

- **README**: Listed as contributors
- **Release Notes**: Mentioned in release notes
- **Contributors Page**: Featured on the contributors page

Thank you for contributing to our project! 🎉
