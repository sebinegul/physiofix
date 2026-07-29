/**
 * Injects section images into blog HTML content.
 * Places an image after each H2 section heading.
 */

interface SectionBlock {
  type: "heading" | "text" | "image";
  content: string;
}

/**
 * Takes blog HTML content + an array of image URLs and returns
 * augmented HTML with images inserted after each H2 heading.
 */
export function injectSectionImages(html: string, imageUrls: string[]): string {
  // Split on H2 tags to find section boundaries
  const sections = html.split(/(<h2[^>]*>.*?<\/h2>)/i);
  const result: string[] = [];
  let imgIdx = 0;

  for (let i = 0; i < sections.length; i++) {
    result.push(sections[i]);

    // After each H2 heading (that's not the last section), inject an image
    if (/^<h2/i.test(sections[i]) && i < sections.length - 1 && imgIdx < imageUrls.length) {
      const imgUrl = imageUrls[imgIdx];
      result.push(
        `<div class="blog-section-image" data-image-index="${imgIdx}">` +
          `<img src="${imgUrl}" alt="" loading="lazy" />` +
        `</div>`
      );
      imgIdx++;
    }
  }

  return result.join("");
}
