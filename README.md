## React Router v8 Workshop

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![React Router](https://img.shields.io/badge/React_Router-v8-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Status](https://img.shields.io/badge/Status-Completed-success?style=for-the-badge)

### Overview

This repository contains a workshop project focused on exploring advanced patterns in **React Router v8** through a realistic Instagram-inspired application.

The purpose of this project is not to build a production-ready social media platform, but to understand how modern routing, data mutations, and UI feedback patterns work together in real applications.

The Instagram-style interface is simply a **vehicle for learning routing concepts**, not the end goal itself.

### Core Idea

The central idea of this workshop is to understand how to recreate a navigation experience similar to Instagram, where:

- Clicking a post opens a **modal overlay**
- The feed remains visible in the background
- The URL updates to `/post/:id`
- The URL remains shareable and reload-safe
- Opening the same URL directly shows a **full-page view instead of a modal**

This creates a dual behavior system where navigation depends on **how the route is accessed**, not just the route itself.

### The Problem

Normally, React Router tightly couples a URL with a single UI state.

This makes modal-based navigation difficult:

- You either lose the background feed when opening a post
- Or you lose proper URL-based navigation
- Or you end up managing modal state manually outside the router

The challenge is achieving both:

1. Modal experience inside the feed
2. Full-page experience when visiting the same URL directly

### The Solution: `mask` Prop

React Router v8 introduces the **`mask`** prop to solve exactly this problem.

It allows a single navigation to behave in two ways at once:

- **`to`** → the actual route React Router navigates to internally
- **`mask`** → the URL shown in the browser address bar

This means:

- The app can render a modal on top of the feed
- While still updating the URL to something shareable
- And still render a full-page route when accessed directly

This concept is the foundation of the entire workshop.

### Branch Structure

This repository contains two intentional branches that represent the learning progression. They are not meant to be merged.

#### `main`

The `main` branch contains the foundational implementation of the workshop.

It includes:

- React Router v8 modal/background routing
- `mask`-based navigation
- `useFetcher()` fundamentals
- Basic post interactions (like, bookmark, comment)
- Core Instagram-style feed layout

This branch focuses on understanding how routing and data mutations work together at a basic level.

It establishes the mental model for modal routing and introduces `useFetcher()` as the primary tool for handling in-place updates.

#### `fetcher-v2`

The `fetcher-v2` branch builds on top of the foundation established in `main`.

It introduces more advanced interaction patterns and improves the user experience significantly.

It includes:

- Enhanced modal routing behavior
- Optimistic UI updates
- Skeleton loading states
- Reduced reliance on `useFetcher()` where optimistic updates are more appropriate
- Improved interaction responsiveness across the app

In this version, `useFetcher()` is still used selectively (for example, comment submission from the feed), but the focus shifts toward **optimistic UI as the primary interaction model**.

This branch represents the most complete version of the workshop.

### Key Concepts Learned

#### Modal Routing with `mask`

The biggest takeaway from this workshop is how the `mask` prop allows React Router to separate:

- Internal navigation state
- Visible URL state

This enables Instagram-style navigation without global state or hacks.

#### `useFetcher()`

`useFetcher()` was used to perform non-navigational mutations such as:

- Adding comments
- Liking posts
- Bookmarking posts

It allows data to update without triggering route transitions.

#### Optimistic UI

Optimistic updates were introduced in the second branch to improve responsiveness by updating the UI immediately before the server confirms the change.

This creates a smoother and more modern user experience.

#### Skeleton Loading

Skeleton loading was explored as a way to improve perceived performance by showing placeholder UI while data is being fetched.

### Design Decisions

The UI is intentionally inspired by Instagram’s dark theme web interface.

This choice was made to:

- Keep the interface familiar
- Reduce cognitive load
- Allow focus on routing behavior instead of UI complexity
- Highlight interaction patterns clearly

### Non-Goals

This project is intentionally scoped as a learning workshop.

It is not intended to be a fully production-ready application.

As a result:

- The application is **not fully responsive**
- UI polish is intentionally minimal
- Accessibility improvements are not the focus
- Some features are simplified to highlight routing behavior

The goal is clarity of concepts, not completeness of product features.

### Notes

This repository also includes personal notes from the workshop, especially around:

- Modal routing patterns
- The `mask` prop behavior
- `useFetcher()` usage patterns

These notes helped reinforce the concepts during implementation.

### Technologies Used

- React
- React Router v8
- Vite
- JavaScript (ES6+)
- CSS

### Final Takeaway

This workshop helped solidify how modern routing systems can go beyond simple page navigation.

By combining modal routing (`mask`), `useFetcher()`, optimistic UI, and skeleton loading, it becomes possible to build highly interactive applications that feel fast, fluid, and app-like without leaving the routing system.

The most important learning was understanding how React Router can manage **both navigation and UI state transitions simultaneously** in a clean and declarative way.
