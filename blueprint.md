# Project Savers - Blueprint

## Overview
Project Savers is a modern, framework-less web application designed to be visually impactful and functionally efficient. The current focus is on creating a high-quality partnership inquiry system using Formspree.

## Application Details
- **Tech Stack:** Vanilla HTML5, Modern CSS (Baseline), ES Modules (JavaScript).
- **Design Philosophy:**
    - **Vibrant & Energetic:** Using a bold color palette with `oklch` and `lch` for maximum vibrancy.
    - **Depth & Texture:** Multi-layered drop shadows for a "lifted" card effect and subtle noise textures for a premium feel.
    - **Interactive:** Glow effects on buttons and focus states for better user engagement.
    - **Responsive:** Mobile-first design using Container Queries and Flexbox/Grid.
- **Features:**
    - Partnership Inquiry Form: Integrated with Formspree for seamless lead collection.

## Implementation Plan - Partnership Form
1. **HTML Structure:**
    - Create a `<section>` for the contact form.
    - Use standard form elements (`input`, `textarea`, `select`) with appropriate labels for accessibility.
    - Integrate Formspree endpoint: `https://formspree.io/f/xeelwyjq`.
2. **Modern CSS Styling:**
    - Implement a "Glassmorphism" or "Neumorphism-inspired" card for the form.
    - Use CSS Variables for a dynamic theme.
    - Add animations for form entry and submission feedback.
3. **Interactive Enhancements:**
    - Add JavaScript to handle form submission states (loading/success) to improve UX.
