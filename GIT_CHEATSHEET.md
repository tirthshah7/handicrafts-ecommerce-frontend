# Git Cheatsheet

Quick reference for common Git commands used in this project.

## 🚀 Quick Start

```bash
# Clone repository
git clone <repository-url>
cd handicrafts-ecommerce-frontend

# Install dependencies
npm install

# Start development
npm run dev
```

## 🌳 Branch Management

```bash
# List all branches
git branch -a

# Create and switch to new branch
git checkout -b feature/new-feature

# Switch to existing branch
git checkout develop

# Delete branch (local)
git branch -d feature/old-feature

# Delete branch (remote)
git push origin --delete feature/old-feature
```

## 📝 Committing Changes

```bash
# Check status
git status

# Add all changes
git add .

# Add specific files
git add src/components/header.tsx

# Commit with message
git commit -m "feat(payment): add Razorpay integration"

# Commit with detailed message
git commit -m "feat(payment): add Razorpay integration

- Implement payment processing
- Add signature verification
- Update order creation flow"
```

## 🔄 Syncing with Remote

```bash
# Fetch latest changes
git fetch origin

# Pull changes
git pull origin develop

# Push changes
git push origin feature/new-feature

# Push and set upstream
git push -u origin feature/new-feature
```

## 🔀 Merging and Rebasing

```bash
# Merge branch into current branch
git merge feature/new-feature

# Rebase current branch onto another
git rebase develop

# Interactive rebase (last 3 commits)
git rebase -i HEAD~3

# Abort rebase
git rebase --abort
```

## 📊 Viewing History

```bash
# View commit history
git log

# View history with graph
git log --oneline --graph --decorate --all

# View last commit
git log -1

# View changes in last commit
git show

# View changes between branches
git diff develop..feature/new-feature
```

## 🏷️ Tagging

```bash
# Create lightweight tag
git tag v1.0.0

# Create annotated tag
git tag -a v1.0.0 -m "Release version 1.0.0"

# List tags
git tag

# Push tags
git push origin v1.0.0

# Push all tags
git push origin --tags
```

## 🔧 Configuration

```bash
# Set user name
git config --global user.name "Your Name"

# Set user email
git config --global user.email "your.email@example.com"

# View configuration
git config --list

# View specific config
git config user.name
```

## 🚨 Emergency Commands

```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Revert a commit
git revert <commit-hash>

# Find lost commits
git reflog

# Recover from reflog
git checkout <commit-hash>
```

## 🧹 Cleaning Up

```bash
# Remove untracked files
git clean -f

# Remove untracked files and directories
git clean -fd

# Remove ignored files
git clean -fX

# Remove all untracked files
git clean -fx
```

## 📋 Stashing

```bash
# Stash current changes
git stash

# Stash with message
git stash save "Work in progress"

# List stashes
git stash list

# Apply most recent stash
git stash pop

# Apply specific stash
git stash apply stash@{0}

# Drop stash
git stash drop stash@{0}
```

## 🔍 Searching

```bash
# Search in commit messages
git log --grep="payment"

# Search in code
git log -S "Razorpay"

# Search in file content
git log -p -- src/components/payment-modal.tsx

# Find when line was added/removed
git blame src/components/payment-modal.tsx
```

## 🛠️ Useful Aliases

```bash
# Set up aliases
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual '!gitk'
git config --global alias.lg 'log --oneline --graph --decorate --all'
```

## 📱 Project-Specific Commands

### Feature Development
```bash
# Start new feature
git checkout develop
git pull origin develop
git checkout -b feature/payment-integration

# Work on feature
git add .
git commit -m "feat(payment): add Razorpay integration"

# Push feature
git push origin feature/payment-integration
```

### Bug Fixes
```bash
# Start bug fix
git checkout develop
git checkout -b bugfix/cart-item-removal

# Fix bug
git add .
git commit -m "fix(cart): resolve item removal issue"

# Push fix
git push origin bugfix/cart-item-removal
```

### Hotfixes
```bash
# Start hotfix
git checkout main
git checkout -b hotfix/critical-security-issue

# Fix issue
git add .
git commit -m "hotfix(security): patch critical vulnerability"

# Push hotfix
git push origin hotfix/critical-security-issue
```

## 🎯 Common Workflows

### Daily Development
```bash
# Start of day
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/new-feature

# Work and commit frequently
git add .
git commit -m "feat: implement new feature"

# End of day
git push origin feature/new-feature
```

### Code Review
```bash
# Before creating PR
git checkout develop
git pull origin develop
git checkout feature/new-feature
git rebase develop

# Push updated branch
git push origin feature/new-feature
```

### Release Preparation
```bash
# Create release branch
git checkout develop
git checkout -b release/v1.0.0

# Make release commits
git commit -m "chore: bump version to 1.0.0"

# Merge to main
git checkout main
git merge release/v1.0.0
git tag v1.0.0

# Merge back to develop
git checkout develop
git merge main
```

## 🚀 Quick Tips

1. **Commit Often**: Make small, frequent commits
2. **Write Good Messages**: Use conventional commit format
3. **Review Before Push**: Always review your changes
4. **Keep Branches Clean**: Rebase before merging
5. **Use Tags**: Tag releases for easy reference
6. **Backup Work**: Push branches frequently
7. **Read Documentation**: Check `GIT_WORKFLOW.md` for detailed guidelines

## 📚 Additional Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
