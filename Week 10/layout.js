const getStyle = (element) => {
    if (!element.style) {
        element.style = {};
    }

    for (let prop in element.computedStyle) {
        element.style[prop] = element.computedStyle[prop].value;

        if (element.style[prop].toString().match(/px$/)) {
            element.style[prop] = parseInt(element.style[prop]);
        }

        if (element.style[prop].toString().match(/^[0-9]+$/)) {
            element.style[prop] = parseInt(element.style[prop]);
        }
    }

    return element.style;
}


function layout(element) {
    if (!element.computedStyle) {
        return;
    }

    let elementStyle = getStyle(element);

    if (elementStyle.display !== 'flex') {
        return;
    }

    const items = element.children.filter(e => e.type === 'element');

    items.sort((a, b) => a.order - b.order)

    let style = elementStyle;

    const setDefault = (prop, defaultValue) => {
        if (!style[prop] || style[prop] === 'auto') {
            style[prop] = defaultValue;
        }
    }

    ['width', 'height'].forEach(size => {
        if (style[size] === 'auto' || style[size] === '') {
            style[size] = null;
        }
    });

    setDefault('flexDirection', 'row');
    setDefault('alignItems', 'stretch');
    setDefault('justifyContent', 'flex-start');
    setDefault('flexWrap', 'nowrap');
    setDefault('alignContent', 'stretch');

    let mainSize, mainStart, mainEnd, mainSign, mainBase, crossSize, crossStart, crossEnd, crossSign, crossBase;

    if (style.flexDirection === 'row') {
        mainSize = 'width';
        mainStart = 'left';
        mainEnd = 'right';
        mainSign = +1;
        mainBase = 0;

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }

    if (style.flexDirection === 'row-reverse') {
        mainSize = 'width';
        mainStart = 'right';
        mainEnd = 'left';
        mainSign = -1;
        mainBase = style.width;

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
    }

    if (style.flexDirection === 'column') {
        mainSize = 'height';
        mainStart = 'top';
        mainEnd = 'bottom';
        mainSign = +1;
        mainBase = 0;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }

    if (style.flexDirection === 'column-reverse') {
        mainSize = 'height';
        mainStart = 'bottom';
        mainEnd = 'top';
        mainSign = -1;
        mainBase = style.height;

        crossSize = 'width';
        crossStart = 'left';
        crossEnd = 'right';
    }

    if (style.flexWrap === 'wrap-reverse') {
        let tmp = crossStart;
        crossStart = crossEnd;
        crossEnd = tmp;
        mainSign = -1;
    } else {
        crossBase = 0;
        crossSign = 1;
    }

    const isAutoMainSize = false;
    if (!style[mainSize]) {
        style[mainSize] = 0;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const itemStyle = getStyle(item);
            if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== undefined) {
                style[mainSize] = style[mainSize] + itemStyle[mainSize];
            }
            isAutoMainSize = true;
        }
    }

    // 收集元素
    let flexLine = [];
    let flexLines = [flexLine];

    let mainSpace = style[mainSize];
    let crossSpace = 0;

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const itemStyle = getStyle(item);

        if (itemStyle[mainSize] === null) {
            itemStyle[mainSize] = 0;
        }

        // 如果有flex，肯定可以塞入当前行
        if (itemStyle.flex) {
            flexLine.push(item);
        } else if (style.flexWrap === 'nowrap' && isAutoMainSize) {
            mainSpace -= itemStyle[mainSize];
            if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== undefined) {
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
            }
            flexLine.push(item);
        } else {
            if (itemsStyle[mainSize] > style[mainSize]) {
                itemsStyle[mainSize] = style[mainSize];
            }
            if (mainSpace < itemStyle[mainSize]) {
                flexLine.mainSpace = mainSpace;
                flexLine.crossSpace = crossSpace;
                flexLine = [item];
                flexLines.push(flexLine);
                mainSpace = style[mainSize];
                crossSpace = style[mainSize];
                crossSpace = 0;
            } else {
                flexLine.push(item);
            }
            if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== undefined) {
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
            }
            mainSpace -= itemStyle[mainSize];
        }
    }
    flexLine.mainSpace = mainSpace;

    if (style.flexWrap === 'nowrap' || isAutoMainSize) {
        flexLine.crossSpace = (style[crossSize] !== undefined) ? style[crossSize] : crossSpace;
    } else {
        flexLine.crossSpace = crossSpace;
    }

    if (mainSpace < 0) {
        let scale = style[mainSize] / (style[mainSize] - mainSpace);
        let currentMain = mainBase;
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const itemStyle = getStyle(item);

            if (itemsStyle.flex) {
                itemStyle[mainSize] = 0;
            }

            itemStyle[mainSize] = itemStyle[mainSize] * scale;

            itemStyle[mainStart] = currentMain;
            itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
            currentMain = itemStyle[mainEnd];
        }
    } else {
        flexLines.forEach(items => {
            let mainSpace = items.mainSpace;
            let flexTotal = 0;
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const itemStyle = getStyle(item);

                if (itemsStyle.flex !== null && itemsStyle.flex !== undefined) {
                    flexTotal += itemsStyle.flex;
                    continue;
                }
            }

            if (flexTotal > 0) {
                const currentMain = mainBase;
                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    const itemStyle = getStyle(item);

                    if (itemsStyle.flex) {
                        itemStyle[mainSize] = (mainSpace / flexTotal);
                    }
                    itemStyle[mainStart] = currentMain;
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                    currentMain = itemStyle[mainEnd];
                }
            } else {
                let currentMain, step;
                switch (style.justifyContent) {
                    case 'flex-start':
                        currentMain = mainBase;
                        step = 0;
                        break;
                    case 'flex-end':
                        currentMain = mainSpace * mainSign + mainBase;
                        step = 0;
                        break;
                    case 'center':
                        currentMain = mainSpace / 2 * mainSign + mainBase;
                        step = 0;
                        break;
                    case 'space-between':
                        currentMain = mainBase;
                        step = mainSpace / (items.length - 1) * mainSign;
                        break;
                    case 'space-around':
                        step = mainSpace / items.length * mainSign;
                        currentMain = step / 2 + mainBase;
                        break;
                }
                for (let i = 0; i < items.length; i++) {
                    let item = items[i];
                    const itemStyle = getStyle(item);
                    itemStyle[mainStart] = currentMain;
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                    currentMain = itemStyle[mainEnd] + step;
                }
            }

        })
    }

    // 次轴计算
    let crossSpace;

    if (!style[crossSize]) {
        crossSpace = 0;
        style[crossSize] = 0;
        for (let i = 0; i < flexLines.length; i++) {
            style[crossSpace] = style[crossSize] + flexLines[i].crossSpace;
        }
    } else {
        crossSpace = style[crossSize];
        for (let i = 0; i < flexLine.length; i++) {
            crossSpace -= flexLine[i].crossSpace;
        }
    }

    if (style.flexWrap === 'wrap-reverse') {
        crossBase = style[crossSize];
    } else {
        crossBase = 0;
    }
    let lineSize = style[crossSize] / flexLines.length;
    let step;
    switch (style.alignContent) {
        case 'flex-start':
            crossBase = +0;
            step = 0;
            break;
        case 'flex-end':
            crossBase += crossSpace * crossSign;
            step = 0;
            break;
        case 'center':
            crossBase += crossSpace / 2 * crossSign;
            step = 0;
            break;
        case 'space-between':
            step = crossSpace / (flexLines.length - 1);
            crossBase += 0;
            break;
        case 'space-around':
            step = crossSpace / flexLines.length;
            crossBase += crossSign * step / 2;
            break;
        case 'stretch':
            crossBase += 0;
            step = 0;
            break;
    }
    flexLines.forEach(items => {
        let lineCrossSize = style.alignContent === 'stretch' ? items.crossSpace + crossSpace / flexLines.length : items.crossSpace;
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            const itemStyle = getStyle(item);
            let align = itemStyle.alignSelf || style.alignItems;
            if (item === null) {
                itemStyle[crossSize] = (align === 'stretch') ? lineCrossSize : 0;
            }
            switch (align) {
                case 'flex-start':
                    itemStyle[crossStart] = crossBase;
                    itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemsStyle[crossSize];
                    break;
                case 'flex-end':
                    itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize;
                    itemStyle[crossStart] = itemsStyle[crossEnd] - crossSign * itemsStyle[crossSize];
                    break;
                case 'center':
                    itemStyle[crossStart] = crossBase + crossSign * (lineCrossSize - itemStyle[crossSize]) / 2;
                    itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemsStyle[crossSize];
                    break;
                case 'stretch':
                    itemStyle[crossStart] = crossBase;
                    itemStyle[crossEnd] = crossBase + crossSign * (itemsStyle[crossSize] !== null && itemsStyle[crossSize] !== undefined ? itemsStyle[crossSize] : lineCrossSize)
                    itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart]);
                    break;
            }
        }
        crossBase += crossSign * (lineCrossSize + step);
    });

    console.log(items);
}

module.exports = layout;