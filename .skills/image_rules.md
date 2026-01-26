---
name: image-creation-rules
description: Rules for generating article cover images.
---

# Image Creation Rules

## 1. File Specifications
*   **Filename**: Must be **`cover.jpg`** (strictly enforced for Page Bundles).
*   **Format**: JPEG
*   **Aspect Ratio**: 16:9 (Landscape)
*   **Placement**: Inside the article's Page Bundle directory (e.g., `content/blog/category/slug/cover.jpg`).

## 2. Design Constraints
*   **NO TEXT**: Do **NOT** include any text inside the image. The article title will be overlaid by the CSS/theme.
*   **Subject**: Abstract, symbolic, or atmospheric representations of the topic. Avoid generic "stock photo of people shaking hands" styles.

## 3. Aesthetic Theme (Syllabus Hack Brand)
*   **Keywords**: Cyberpunk, Neon, Glitch, Blueprint, Digital Network, AI Neural Nodes, Terminal Green, Matrix code (abstract).
*   **Color Palette**:
    *   **Primary**: Black/Dark Grey backgrounds.
    *   **Accent**: Neon Green (`#00ff00` approx), Cyan, Electric Blue, Hot Pink (for contrast).
*   **Vibe**: "Hacking the system", "Digital intelligence", "Future of learning".

## 4. Prompting Strategy (for DALL-E 3 / Flux)
*   **Style Modifiers**: `cyberpunk style, digital art, high contrast, neon lighting, futuristic, minimal, abstract 3d render`
*   **Negative Prompt**: `text, letters, words, watermark, realistic photo of people, cluttered, low quality`
