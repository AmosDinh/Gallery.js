## Gallery.js
Gallery.js looks similar to the desktop Google-Picture gallery.
I wrote this gallery with easy modification in mind. 
It will also resize properly.

![](Desktop.gif)

### Get started

html

```<div id=gallery></div>```


javascript
```markdown

//init
let gallery = new Gallery()
gallery.init()

//add Image
let img = document.createElement('img')
img.onload = function(){
      gallery.addImage(img)
}
img.src = 'url'

```

### Additional information (please see example.html for further information)
The gallery-width is determined by the html element width;

add row settings

```gallery.options.row.newSize = {width: 2000,perRow:20 ,margin: 13};```

change row settings

```gallery.options.row.verLarge.width = 1500;```

Gallery.options

```
gallery.options = {
        row: {
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
                margin: 10,
            },
            verySmall: {
                width: 550,
                perRow: 3,
                margin: 9,
            },
            tiny: {
                width: 320,
                perRow: 2,
                margin: 9,
            }
        },

        width: function () {
            return document.getElementById(thisGallery.options.galleryId).clientWidth
        },

        galleryId: "gallery",
        autoBuild: true,
        getImgGreyValue: false,
        initBool: true,
        cssStyles: function () {
            return ".row{display: flex;justify-content:space-around;}.imgWrapper{display:inline-block;display:-moz-inline-box;}.imgHover:hover{box-shadow: 0 4px 14px rgba(0,0,0,0.5)}#" + thisGallery.options.galleryId + "{box-sizing:border-box;}"
        }
}
```

