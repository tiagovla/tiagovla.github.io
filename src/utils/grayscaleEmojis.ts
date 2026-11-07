export function grayscaleEmojis(root: Element | null) {
    if (!root || typeof Intl.Segmenter !== 'function') return

    const emojiPattern =
        /(?:\p{Extended_Pictographic}|\p{Regional_Indicator}{2}|[#*0-9]\uFE0F?\u20E3)/u
    const textNodes: Text[] = []
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)

    while (walker.nextNode()) {
        const node = walker.currentNode as Text
        if (emojiPattern.test(node.data)) textNodes.push(node)
    }

    const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })

    for (const node of textNodes) {
        const fragment = document.createDocumentFragment()

        for (const { segment } of segmenter.segment(node.data)) {
            if (emojiPattern.test(segment)) {
                const emoji = document.createElement('span')
                emoji.className = 'post-emoji'
                emoji.textContent = segment
                fragment.append(emoji)
            } else {
                fragment.append(document.createTextNode(segment))
            }
        }

        node.replaceWith(fragment)
    }
}
