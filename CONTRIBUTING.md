# Contributing to Escrow-FairLance Client

Thank you for your interest in contributing to the **Escrow-FairLance** protocol! We welcome contributions from developers, auditors, designers, and translators across the globe.

---

## 🧭 Code of Conduct

All contributors are expected to uphold our [Code of Conduct](CODE_OF_CONDUCT.md). Please report unacceptable behavior to security@escrow-fairlance.org.

---

## 🛠️ Development Setup

### Prerequisites
- [Bun](https://bun.sh) (recommended) or Node.js v20+
- Git
- [Freighter Wallet](https://www.freighter.app/) extension (configured for Stellar Testnet)

### Steps
1. Fork and clone the repository:
   ```bash
   git clone https://github.com/<your-username>/Gig-escrow-app.git
   cd Gig-escrow-app
   ```
2. Install dependencies:
   ```bash
   bun install
   ```
3. Copy environment configuration:
   ```bash
   cp .env.example .env.local
   ```
4. Run the development server:
   ```bash
   bun run dev
   ```

---

## 🧪 Verification & Testing

Before submitting your pull request, ensure all validation passes:
```bash
# Type check TypeScript definitions
bun run typecheck

# Run linter
bun run lint

# Execute automated test suite
bun test

# Validate production build
bun run build
```

---

## 📝 Commit Conventions

We enforce [Conventional Commits](https://www.conventionalcommits.org/):
- `feat(...)`: New user-facing feature or capability
- `fix(...)`: Bug fix or security patch
- `test(...)`: Unit, integration, or contract tests
- `refactor(...)`: Code changes that neither fix a bug nor add a feature
- `chore(...)`: Dependency updates, tooling, or repository maintenance
- `docs(...)`: Documentation updates

---

## 🚀 Submitting a Pull Request

1. Create a feature branch: `git checkout -b feat/my-improvement`
2. Commit your changes following conventional commits.
3. Push to your fork: `git push origin feat/my-improvement`
4. Open a Pull Request referencing relevant issues.
