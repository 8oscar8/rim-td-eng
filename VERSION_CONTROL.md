# 🛡️ Settlement Security Protocol: Version Control & Auto-Backup Workflow

To prevent data loss during development or unexpected system errors, we have established a robust version control system using **Git**.

## 1. Basic Git Operation Strategy

### 📂 Commit Upon Feature Completion
Every time a meaningful functional change (e.g., research system overhaul, dispatch bonus addition, etc.) is completed, the current state is recorded in the local repository.

- **Method**: Ask Antigravity "Commit this" during conversation, or run the following command in the terminal:
  
  ```bash
  git add .
  git commit -m "feat: [Feature Summary]"
  ```

### ⏪ Rollback (Recovery) When Problems Occur
If the code becomes tangled or issues arise, you can return to a working point at any time.

- **Restore to most recent state**: `git checkout .` (Deletes unsaved changes)
- **Restore to specific point (commit)**: `git reset --hard [CommitID]`

## 2. Antigravity-Exclusive Task Workflow (Safety Mechanisms)

Adhere to the following steps when collaborating with Antigravity to prevent accidents.

1.  **[Git Always Active]**: Ensure `git init` is complete before starting work (Already completed).
2.  **[Implementation & Verification]**: Complete feature implementation and local testing.
3.  **[Regular Snapshot]**: Antigravity performs a commit at the end of a work session or upon request.
4.  **[Backup Folder Usage]**: Create temporary copies in the `temp_backup/` folder before major logic modifications (if necessary).

## 3. Remote Backup (GitHub Recommended)

To prepare for physical hardware failure or file loss on your local PC, connecting to an external remote repository is essential.

- **After creating a GitHub repository**:
  
  ```bash
  git remote add origin [Your-Repo-URL]
  git push -u origin main
  ```

> **Antigravity's Promise:** Every time I complete a major modification, I will first ask, "Shall I commit the current state?" Upon your approval, I will safely record the current state in the repository to perfectly prepare for any situation.
