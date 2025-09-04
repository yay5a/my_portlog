# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm install    # Install dependencies
npm run dev    # Start development server at http://localhost:3000
npm run build  # Create production build
npm run start  # Start production server
npm run lint   # Run ESLint
```

## Architecture Overview

This is a Next.js 15+ portfolio/blog website using the App Router pattern with MDX for content management.

### Key Architectural Patterns

- **App Router Structure**: Uses `app/` directory with Next.js 13+ conventions
- **MDX Content System**: Blog posts in `content/posts/` with frontmatter metadata
- **Dual Content Processing**: 
  - `utils/mdxUtils.js` processes MDX files with `gray-matter` for listing/indexing
  - Next.js MDX loader with `remark-mdx-frontmatter` plugin exports metadata from frontmatter
- **Server Components First**: Uses React Server Components by default

### Content Management

Blog posts are MDX files in `content/posts/` with frontmatter:
```mdx
---
title: Post Title
date: YYYY-MM-DD
description: Brief description
---
```

**Important**: The MDX configuration in `next.config.mjs` uses `remarkMdxFrontmatter` with `name: "metadata"` to export frontmatter as a `metadata` named export from MDX files. This allows direct imports like:
```javascript
const { default: Post, metadata } = await import(`@/content/posts/${slug}.mdx`);
```

### Directory Structure

- `app/`: Next.js App Router pages and layouts
- `content/posts/`: MDX blog post files
- `content/projects/`: MDX project files  
- `components/`: Reusable React components
- `utils/mdxUtils.js`: Content processing utilities with `getMdxContent()`, `getBlogPosts()`, `getProjects()`

### Key Dependencies

- **MDX Stack**: `@next/mdx`, `gray-matter`, `remark-frontmatter`, `remark-mdx-frontmatter`
- **Styling**: TailwindCSS with typography plugin
- **Animations**: tsparticles for background effects
- **Database**: Mongoose (for contact/API features)

## Technical Notes

- Watch for naming conflicts when importing `metadata` (layout metadata vs MDX metadata)
- MDX files are processed differently by `gray-matter` utility functions vs Next.js MDX loader
- TailwindCSS classes should be used for all styling
- Static generation uses `generateStaticParams()` with `getMdxContent()` for blog routes