---
title: "Brightness as depth: how Photo → 3D builds a relief"
date: 2026-10-02 11:00:00 +0000
track: spatial
kind: Method
summary: "A walk through the height-map pipeline behind Photo → 3D, the assumption it rests on, and where that assumption breaks."
experiments: [photo-to-3d]
---

[Photo → 3D Depth]({{ '/feature/photo-to-3d/' | relative_url }}) turns any picture into a relief with a single, blunt
assumption: **brighter means closer**. This note documents the pipeline exactly as the page implements it, so later
experiments have something concrete to compare against.

## Pipeline

1. **Crop to a square.** The image is drawn onto a 768 × 768 canvas with *cover* scaling — scaled by
   `max(768 / width, 768 / height)` and centred — so the composition stays centred and nothing is stretched.
2. **Smooth.** A copy is drawn through the canvas `blur()` filter. The smoothing slider (0–1) maps to a blur radius of
   0–6 px.
3. **Measure brightness.** Each pixel's luminance is computed with the Rec. 601 weights,
   `Y = 0.299 R + 0.587 G + 0.114 B`, normalised to 0–1 and raised to the power 0.95, which lifts the mid-tones very
   slightly.
4. **Displace.** The greyscale result becomes the `displacementMap` of a `MeshStandardMaterial` on a 1.4 × 1.4 plane
   with 256 × 256 segments; the original colours become its `map`. The depth slider sets `displacementScale`.

The height map can now be downloaded as a PNG from the tool, which makes it easy to inspect exactly what the mesh is
built from.

## A resolution limit worth knowing

Displacement moves *vertices*, and the plane has 257 × 257 of them. The height map is 768 px wide, so each grid step
spans three texture pixels. Detail finer than about 3 px in the cropped image cannot change the shape of the mesh — it
only survives in the colour texture laid over it. Raising the segment count trades frame rate for detail.

## Where the assumption breaks

Brightness mixes up two things that real depth keeps apart:

- **Surface colour.** Dark hair or a black shirt reads as a pit, even when it is the nearest thing in the frame.
- **Lighting.** Shadows become valleys and specular highlights become bumps. A bright, flat background turns into a
  raised plateau around the subject.

This is the familiar failure mode of naive shape-from-shading: luminance is a mix of reflectance, illumination, and
geometry, and the pipeline treats it as geometry alone.

## Open questions

- For which kinds of image does an *inverted* map (darker means closer) read better?
- A learned monocular depth model would separate colour from shape far better. What would we measure to decide whether
  it is better *for this purpose* — a convincing tactile preview — rather than better in general?
- Is smoothing mostly aesthetic, or does it actually make shapes easier to recognise?
