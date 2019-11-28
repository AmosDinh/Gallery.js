function Gallery() {
    let imageArray = [];
    let thisGallery = this;

    this.options = {
        row: {
            /*can add any keyname banana: {width:3984,perRow:3...} width is max width*/
            ultraLarge: {
                width: 1921,
                perRow: 7,
                margin: 12,
            },
            veryLarge: {
                width: 1281,
                perRow: 6,
                margin: 11,
            },
            large: {
                width: 1025,
                perRow: 5,
                margin: 11,
            },
            medium: {
                width: 961,
                perRow: 5,
                margin: 11,
            },
            small: {
                width: 641,
                perRow: 4,
                margin: 11,
            },
            verySmall: {
                width: 550,
                perRow: 3,
                margin: 10,
            },
            tiny: {
                width: 320,
                perRow: 2,
                margin: 10,
            },
            veryTiny: {
                width: 0,
                perRow: 1,
                margin: 9,
            }
        },

        width: function () {
            /* return window.innerWidth - 17 /*scrollbar width */
            return document.getElementById(thisGallery.options.galleryId).clientWidth
        },

        imageTitles: false,
        cssStyles: ".row {display: flex;justify-content: space-around;}.imgWrapper {display: inline-block;display: -moz-inline-box;}",
        galleryId: "gallery",
        autoBuild: true,
        getImgGreyValue: false,
    }

    this.getImageArrayLength = function () {
        return imageArray.length
    }
    this.getOptions = function () {

        const width = this.options.width();
        let rowOptions = this.options.row;
        let list = [];
        for (var k in rowOptions) {
            let w = rowOptions[k].width
            let p = rowOptions[k].perRow
            let m = rowOptions[k].margin
            list.push({
                width: w,
                perRow: p,
                margin: m
            })
        }
        //to get the options smaller-closest to width
        const closestTo = {
            width: width,
            perRow: 111
        }
        list.push(closestTo)

        list.sort(function (a, b) {
            return ((a.width < b.width) ? -1 : ((a.width == b.width) ? 0 : 1));
        });

        return list[list.indexOf(closestTo) - 1]
    }
    let gallery, galleryWidth, margin, rowWidth, perRow;


    this.setDimensions = function () {
        let currentOptions = this.getOptions();
        perRow = currentOptions.perRow;
        margin = currentOptions.margin;
        galleryWidth = this.options.width();
        rowWidth = galleryWidth - margin * 2;

        let galleryId = this.options.galleryId

        gallery = document.getElementById(galleryId)
        gallery.style.padding = margin * 2 + "px " + margin + "px";
        gallery.style.boxSizing = "border-box";
    }

    /*adds Styles init() non auto for setting different css styles*/
    this.init = function () {
        const css = this.options.cssStyles;
        const style = document.createElement('style');

        //adds styles to head
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
        document.getElementsByTagName('head')[0].appendChild(style);
        this.setDimensions();
        console.log(thisGallery)
    }

    /*adds img DOM-element */
    this.addImage = function (img) {
        if (thisGallery.options.getImgGreyValue) {
            imgGreyValue(img, function (brightness) {
                if (brightness < 110) img.classList.add('darkImg')
                else img.classList.add('brightImg')
            })
        }
        imageArray.push(img)
        if (thisGallery.options.autoBuild) thisGallery.callBuildRow();
    }
    /*checks if backgroundfill should be dark or light */
    function imgGreyValue(img, callback) {

        let colorSum = 0;
        const width = img.width;
        let height = img.height;
        let canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        let r, g, b, avg;

        for (var x = 0, len = data.length; x < len; x += 4) {
            r = data[x];
            g = data[x + 1];
            b = data[x + 2];
            avg = Math.floor((r + g + b) / 3);
            colorSum += avg;
        }

        let brightness = Math.floor(colorSum / (width * height));
        callback(brightness);

    }
    this.index = 0; /*imageArray DOM <img> index, set to 0 in setOnResize */
    let resizingBool = false;

    this.callBuildRow = function (doResize) {
        if (doResize && !resizingBool) {
            resizingBool = true;
            this.buildRow();
        } else if (!resizingBool) this.buildRow();
    }
    this.buildRow = function () {

        if (imageArray.length === this.index) return;
        let row;
        // let newIndex = this.newIndex;
        //sets new perRow ....
        if (resizingBool && this.index === 0) {
            gallery.innerHTML = "";
            this.setDimensions();

        }
        /*    let children = gallery.children; */
        row = gallery.lastChild;

        if (!row || row.children.length === perRow) {
            row = document.createElement('div');
            row.classList.add('row')
            gallery.appendChild(row)
        }

        let imgWrappers = row.children;
        const wrapperLength = imgWrappers.length;
        let allInRow = (wrapperLength) ? wrapperLength : 0;
        let newImg = imageArray[this.index];

        let ratii = [];
        let sumRatio = 0;
        for (let i = 0; i < allInRow; i++) {
            let tImg = imgWrappers[i].firstChild.firstChild
            tImg.style.width = null;
            tImg.style.height = null;
            const ratio = tImg.width / tImg.height
            ratii.push(ratio)
            sumRatio += ratio
        }
        const ratio = newImg.width / newImg.height;
        sumRatio += ratio;
        ratii.push(ratio)
        const average = sumRatio / (allInRow + 1);
        sumRatio += allInRow < perRow - 1 ? (perRow - 1 - allInRow) * average : 0;
        /*row height*/
        let indexClosestToAverage = 0;
        let abs = 100;
        for (let i = 0; i < ratii.length; i++) {
            const tAbs = Math.abs(ratii[i] - average)
            if (tAbs < abs) {
                abs = tAbs;
                indexClosestToAverage = i;
            }
        }
        const tempRatio = ratii[indexClosestToAverage]

        const tempWidth = (tempRatio / sumRatio) * rowWidth - margin * 2;
        const rowHeight = tempWidth / tempRatio
        /*row height*/
        row.style.height = rowHeight + "px";
        row.style.marginBottom = margin * 2 + "px";

        for (let i = 0; i < ratii.length; i++) {
            const imgRatio = ratii[i];
            const wrapperWidth = (imgRatio / sumRatio) * rowWidth - margin * 2;
            let imgWidth = "auto";
            let imgHeight = "auto";
            let imgMargin = 0;
            let imgMarginTop = 0;
            if (imgRatio < (wrapperWidth / rowHeight)) {
                imgHeight = rowHeight + "px";
                imgMargin = (wrapperWidth - imgRatio * rowHeight) / 2 + "px";
            } else {
                imgWidth = wrapperWidth + "px";
                imgMarginTop = (rowHeight - wrapperWidth * (1 / imgRatio)) + "px";
            }
            if (i >= allInRow) {
                let img = newImg
                img.style.width = imgWidth;
                img.style.height = imgHeight;
                img.style.margin = imgMarginTop + " " + imgMargin + " 0 " + imgMargin;
                const backgroundColor = img.classList.contains("darkImg") ? "black" : "#F7F7F7";

                /*you can add / change the look of the gallery like this for example (adding links etc.): */
                const htmlText = this.options.imageTitles ? "<div class='imgWrapper' style='width:" + wrapperWidth + "px;background:" + backgroundColor + ";'><div class='imgHover'style='width:100%;height:100%;position:relative;'></div><div class='imageTitle'>" + (img.alt ? img.alt : img.title) + "</div></div>" : "<div class='imgWrapper' style='width:" + wrapperWidth + "px;background:" + backgroundColor + ";'><div class='imgHover'style='width:100%;height:100%;position:relative;'></div></div>"
                row.innerHTML += htmlText
                row.lastChild.firstChild.appendChild(img);
            } else {
                let wrapper = imgWrappers[i];
                wrapper.style.width = wrapperWidth + "px";
                let img = wrapper.firstChild.firstChild;
                img.style.width = imgWidth;
                img.style.height = imgHeight;
                img.style.margin = imgMarginTop + " " + imgMargin + " 0 " + imgMargin;
            }
        }
        this.index = this.index + 1

        if (resizingBool) {
            if (this.index >= imageArray.length) resizingBool = false;
            else this.buildRow();
        }
    }

    /*detects mouse slowdown on resize / can be replaced by simple timeout when the gallery should resize */
    var a, b = 0,
        c = 100,
        d = new Date;
    d = d.getTime();
    var e = new Date,
        f = 0,
        g = 0;
    window.addEventListener('resize', function () {
        c = b;
        b = window.innerWidth;
        f = b < c ? c - b : b - c;
        e = new Date;
        e = e.getTime();
        g = e - d;
        d = e;
        var delay = 1.4 > f / g ? 210 : 900
        clearTimeout(a), a = setTimeout(function () {
            gallery.style.width = null
            gallery.style.width = gallery.clientWidth + "px"
            thisGallery.index = 0;
            thisGallery.callBuildRow(true);
        }, delay)
    });
}
