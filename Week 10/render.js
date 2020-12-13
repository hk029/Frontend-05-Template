const images = require('images');

const render = (viewport, element) => {
    if(element.style) {
        let img = images(element.style.width, element.style.height);

        if(element.style['background-color']) {
            let color = element.style['background-color'] || 'rgb(0, 0, 0)';
            color.match(/rgb\((\d+), (\d+), (\d+)\)/);
            img.fill(Number(Regex.$1), Number(Regex.$2), Number(Regex.$3));
            viewport.draw(img, element.style.left || 0, element.style.top || 0);
        }
    }

    if(element.children) {
        for (let child of element.children) {
            render(viewport, child);
        }
    }
}