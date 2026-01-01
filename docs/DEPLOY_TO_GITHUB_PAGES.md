# Deploy to GitHub Pages Tutorial

This tutorial explains how to deploy your React application to GitHub Pages using GitHub Actions.

## Prerequisites

- Your project is a React app built with Vite.
- You have a GitHub repository set up.
- The repository has GitHub Pages enabled.

## Steps to Deploy

### 1. Configure Your Repository

1. Go to your GitHub repository.
2. Click on "Settings" tab.
3. Scroll down to "Pages" section.
4. Under "Source", select "GitHub Actions".

### 2. Set Up the Workflow

The deployment is automated using GitHub Actions. The workflow file is located at `.github/workflows/deploy.yml`.

Key points about the workflow:
- It triggers on pushes and pull requests to the `main` branch.
- It builds your app using `npm run build`.
- It deploys the built files from the `./dist` directory to GitHub Pages.

### 3. Configure Vite for GitHub Pages

In your `vite.config.ts`, ensure the `base` is set correctly:

```typescript
export default defineConfig(({ mode }) => {
    // ... other config
    return {
      base: '/5/',  // Replace '5' with your repository name
      // ... rest of config
    };
});
```

The `base` should match your repository name. For example, if your repo is `username/repo-name`, set `base: '/repo-name/'`.

### 4. Push Your Changes

1. Commit and push your changes to the `main` branch.
2. The GitHub Actions workflow will automatically run.
3. Once the workflow completes, your site will be available at `https://username.github.io/repository-name/`.

### 5. Troubleshooting

- If the build fails, check the Actions tab in GitHub for error logs.
- Ensure all dependencies are listed in `package.json`.
- Make sure your build command (`npm run build`) works locally.

## Additional Notes

- The workflow uses Node.js 18.
- It caches npm dependencies for faster builds.
- Only one deployment can run at a time to avoid conflicts.
