export * from './extensions.js';

import Slider from './slider.js';

let leftXpos = 10;
let menuHeight = 100;

//Figure out widths
let winWidth = window.innerWidth;
let winHeight = winWidth *.7;
if(winWidth > 900){
    winWidth = 900;
    winHeight = winWidth *.7; 
}

if(winWidth >600){
    
     leftXpos = 200;
     menuHeight = 50;
}

// for this example you have to use mouse or touchscreen

const app = new PIXI.Application({
    width: winWidth,
    height: winHeight +menuHeight,
    backgroundColor: '0xA5C6CC'
});
document.body.appendChild(app.view);


let clipperimg = "url('./img/clipbtn.png'),auto";
let razorimg = "url('./img/razorbtn.png'),auto";
let defaultIcon = clipperimg;


// Add custom cursor styles
app.renderer.plugins.interaction.cursorStyles.default = defaultIcon;
const { stage } = app;


// prepare circle texture, that will be our brush

let brush = new PIXI.Graphics();
brush.beginFill(0xffffff);
brush.drawCircle(0, 0, 20);

brush.endFill();
brush.filters = [new PIXI.filters.BlurFilter(13)];

app.loader.add('t1', './img/long.jpg');
app.loader.add('t2', './img/short.jpg');
app.loader.add('t3', './img/bald.jpg');
app.loader.add('intro', './img/intro.jpg');
app.loader.add('introMobile', './img/introMobile.jpg');
app.loader.load(setup);

const graphicsContain = new PIXI.Container();

let buttonSS = PIXI.Sprite.from('./img/camera_btn.png');
let clearBtn = PIXI.Sprite.from('./img/resetbtn.jpg');
let infoBtn = PIXI.Sprite.from('./img/infobtn.jpg');

let introG;

let renderItems=[];
let renderItem;

function setup(loader, resources) {

/***  UI START ***/ 
    //Brush Slider
    const sizeSlider = new Slider(sliderParams).addTo(app.stage);
    sizeSlider.value = 0.4;
    sizeSlider.rotation =Math.PI /2;
    sizeSlider.x = 10;
    sizeSlider.y = app.screen.height -menuHeight +38;//-15
    stage.addChild(sizeSlider);

    const brushTxt = new PIXI.Text('Brush Size');
    brushTxt.x = 10;
    brushTxt.y = app.screen.height-menuHeight;
    app.stage.addChild(brushTxt);

    const blurText = new PIXI.Text('Brush Blur');
    blurText.x = leftXpos; //200
    blurText.y = app.screen.height - 50;
    app.stage.addChild(blurText);

  
     //Blur Slider
     const blurSlider = new Slider(sliderParams).addTo(app.stage);
     blurSlider.value = .4;
     blurSlider.rotation =Math.PI /2;
     blurSlider.x = leftXpos;//100
     blurSlider.y = app.screen.height - 13 ;
     stage.addChild(blurSlider);


    // add BTN <-- Todo refactor buttons

    const clip = PIXI.Texture.from('./img/clipbtn.png');
    const shave = PIXI.Texture.from('./img/razor.jpg');
    const button = PIXI.Sprite.from(shave);

    // Set the initial position
    infoBtn.anchor.set(0.5);
    infoBtn.x = app.screen.width - 180;
    infoBtn.y = app.screen.height - menuHeight +25;
    // Opt-in to interactivity
    infoBtn.interactive = true; 
    // Shows hand cursor
    infoBtn.buttonMode = true;
    // Pointers normalize touch and mouse
    infoBtn.on('pointerdown', toggleInfo);
    app.stage.addChild(infoBtn);

    // Set the initial position
    button.anchor.set(0.5);
    button.x = app.screen.width - 125;
    button.y = app.screen.height - menuHeight +25;
    // Opt-in to interactivity
    button.interactive = true; 
    // Shows hand cursor
    button.buttonMode = true;
    // Pointers normalize touch and mouse
    button.on('pointerdown', onClick);
    app.stage.addChild(button);

      // Set the initial position
      buttonSS.anchor.set(0.5);
      buttonSS.x = app.screen.width -75;
      buttonSS.y = app.screen.height -menuHeight +25;
      // Opt-in to interactivity
      buttonSS.interactive = true; 
      // Shows hand cursor
      buttonSS.buttonMode = true;

      buttonSS.on('pointerdown', takeScreenshot);
      // Pointers normalize touch and mous
      app.stage.addChild(buttonSS);

    // Set the initial position
    clearBtn.anchor.set(0.5);
    clearBtn.x = app.screen.width -25;
    clearBtn.y = app.screen.height - menuHeight +25;
    // Opt-in to interactivity
    clearBtn.interactive = true; 
    // Shows hand cursor
    clearBtn.buttonMode = true;

    clearBtn.on('pointerdown', clearImg);
    // Pointers normalize touch and mous
    app.stage.addChild(clearBtn);

/***  UI End ***/ 

//** Intro Graphic */
if(winWidth <800){
    introG = new PIXI.Sprite(resources.introMobile.texture);
}else {
    introG = new PIXI.Sprite(resources.intro.texture);   
}

introG.width = app.screen.width;
introG.height = winHeight;
introG.interactive = true; 
app.stage.addChild(introG);

introG.on('pointerdown', toggleInfo);


/**  Drawing  */
   // Add 3 layers
   const background = new PIXI.Sprite(resources.t1.texture);
   graphicsContain.addChild(background);
   background.width = app.screen.width;
   background.height = winHeight;
 
   const imageToReveal = new PIXI.Sprite(resources.t2.texture);
   graphicsContain.addChild(imageToReveal);
   imageToReveal.width = app.screen.width;
   imageToReveal.height = winHeight;

   const layer3 = new PIXI.Sprite(resources.t3.texture);
   graphicsContain.addChild(layer3);
   layer3.width = app.screen.width;
   layer3.height = winHeight;

   //Masks

   const renderTexture = PIXI.RenderTexture.create(app.screen.width, app.screen.height);

   const renderTextureSprite = new PIXI.Sprite(renderTexture);
   graphicsContain.addChild(renderTextureSprite);
   imageToReveal.mask = renderTextureSprite;

   const renderTexture2 = PIXI.RenderTexture.create(app.screen.width, app.screen.height);

   const renderTextureSprite2 = new PIXI.Sprite(renderTexture2);
   graphicsContain.addChild(renderTextureSprite2);
   layer3.mask = renderTextureSprite2;


      app.stage.interactive = true;
      app.stage.on('pointerdown', (pointerDown));
      app.stage.on('pointerup', pointerUp);
      app.stage.on('pointermove', pointerMove);

     renderItems = [renderTexture ,renderTexture2]
     renderItem = renderItems[0];

    let dragging = false;

    function pointerMove(event) {
        if (dragging) {
            brush.clear();
            brush.beginFill(0xffffff);
            brush.drawCircle(0, 0,  sizeSlider.value *30);
            brush.position.copyFrom(event.data.global);
           
            brush.endFill();
            brush.filters = [new PIXI.filters.BlurFilter(25 * blurSlider.value)];
            app.renderer.render(brush, renderItem, false, null, false);
        }
    }

    function pointerDown(event) {
        dragging = true;
        pointerMove(event);
    }

    function pointerUp(event) {
        dragging = false;
    }

    let toggle = false;
    function onClick() {
        if(toggle){
         renderItem = renderItems[0];
         this.texture = shave;
         defaultIcon = clipperimg;
         toggle = false;
        }else{
            renderItem = renderItems[1];
            this.texture = clip;
            defaultIcon = razorimg;
            toggle = true;
        }
        app.renderer.plugins.interaction.cursorStyles.default = defaultIcon;
    }


let infoToggle = true;

function toggleInfo(){
    if(infoToggle){
        introG.texture = "";
        infoToggle = false;
       }else{
           if(winWidth < 800){
                 introG.texture = resources.introMobile.texture;
           }else {
            introG.texture = resources.intro.texture;
           }
        infoToggle = true;
       }
    }
    
    
}


// create slider
const sliderParams =
{
    bg:
    {
        texture : PIXI.Texture.WHITE,
        anchorX : 0.5,
        anchorY : 1,
        tint    : 0x404040,
        width   : 16,
        height  : 128
    },

    fg:
    {
        texture : PIXI.Texture.WHITE,
        anchorX : 0.5,
        anchorY : 1
    }
};

// handle window resize
//window.addEventListener('resize', onResize);

//onResize();

function onResize()
{
    console.log("wow");
    winWidth = window.innerWidth;
    // resize renderer
    const { innerWidth, innerHeight } = window;

    app.renderer.resize(innerWidth, innerHeight);

   /* // reposition slider
    slider.x = innerWidth >> 1;
    slider.y = (innerHeight >> 1) + (slider.bg.height >> 1);*/
}


//* Screen shot**/ 
let wait = false;
let waiting = false;

// Generates a texture object from a container, then give that texture to our
// sprite object and create a download link containing an image of the snapshot
// we just took

// Note that we can do this with any container. Instead of 'app.stage', which
// contains everything, try the 'bunnyContainer' instead.
function takeScreenshot() {
    
    wait = true;
    app.renderer.extract.canvas(graphicsContain).toBlob((b) => {
        const a = document.createElement('a');
        document.body.append(a);
        a.download = 'shavejoe';
        a.href = URL.createObjectURL(b);
        a.click();
        a.remove();
    }, 'image/png');
    
  
}
function clearImg(){ 
    for(let i = renderItems.length; i >= 0; i--){
        brush.clear();
        app.renderer.render(brush, renderItems[i], true, null, false);
    }
}



app.stage.addChild(graphicsContain);