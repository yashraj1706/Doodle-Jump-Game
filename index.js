document.addEventListener('DOMContentLoaded',()=>{
    const grid=document.querySelector(".grid");
    const doodler=document.createElement('div');
    let doodlerLeftSpacing=50;
    let startPoint=150
    let doodlerBottomSpacing=startPoint;
    let isGameOver=false;
    let platformCount=5;
    let platforms=[];
    let upTimerId;
    let downTimerId;
    let goingLeft;
    let goingRight;
    let isJumping=false;
    let isGoingLeft=false;
    let isGoingRight=false;
    let highscore=window.localStorage.getItem('highscore');
    let score=0;
    let width=screen.width;
    let blur;
    let level=0;
    let endGamePopup;
    let fallSpeed=[5,6,7,8,9,10,11,12,13,14];
    let jumpSpeed=[5,6,7,8,9,10,11,12,13,14];
    let platformLevel=[3,4,5,6,7,8,9,10,11,12]
    let platformSpeed=2;


    function toggle(){
        blur=document.getElementById('blur')
        endGamePopup=document.getElementById('endGamePopup');
        blur.classList.toggle('active')
        endGamePopup.classList.toggle('active')
    }

    if(width<500){
        document.getElementById('mobileControls').classList.add('active');
    }

    
    clearInterval(upTimerId)
    clearInterval(goingLeft);
    clearInterval(goingRight);
    clearInterval(downTimerId);
    document.querySelector('#moveRight').addEventListener('click',moveRight)
    document.querySelector('#moveLeft').addEventListener('click',moveLeft)
    let StartButton=document.querySelector('#moveStraight')
    StartButton.addEventListener('click',moveStraight)

   



    function start(){
        if(!isGameOver){
            
            createPlatform();
            createDoodler();
            setInterval(movePlatforms,25);
            jump()
            document.addEventListener('keyup',control);
        }
    }

    function control(e){
        if(e.key==='ArrowUp'){
           moveStraight()
        }else if(e.key==='ArrowLeft'){
            moveLeft(); 
        }else if(e.key==='ArrowRight'){
            moveRight();
        }      
    }



    //MOVING STRAIGHT
    function moveStraight(){
        isGoingLeft=false;
        isGoingRight=false;
        clearInterval(goingLeft);
        clearInterval(goingRight);
    }


    //MOVING LEFT FUNCTION
    function moveLeft(){
        if (isGoingLeft) return
        if(isGoingRight){
            clearInterval(goingRight);
            isGoingRight=false;
        }
        isGoingLeft=true;
        goingLeft=setInterval(() => {
            if(doodlerLeftSpacing>=0 && !isGoingRight)
            {
                doodlerLeftSpacing-=4;
                doodler.style.left=doodlerLeftSpacing+ "px";    
            }else{
                moveRight();
            }
        },30);
    }


    //MOVING RIGHT FUNCTION
    function moveRight(){
        if (isGoingRight) return;
        if(isGoingLeft){
            clearInterval(goingLeft);
            isGoingLeft=false;
        }
        isGoingRight=true;
        goingRight=setInterval(() => {
            if(doodlerLeftSpacing<=315 && !isGoingLeft)
            {
                doodlerLeftSpacing+=5;
                doodler.style.left=doodlerLeftSpacing+ "px";
            }else{
                moveLeft();
            }
        }, 30);
    }

    //platform constructor
    class Platform{
        constructor(newPlatformBottom){
            this.bottom=newPlatformBottom;
            this.left=Math.random()*315;
            this.visual=document.createElement('div');
            const visual=this.visual;
            visual.classList.add('platform')
            visual.style.left=this.left + 'px';
            visual.style.bottom=this.bottom + 'px';
            grid.appendChild(visual);
        }
    }

    //creating platforms
    function createPlatform(){
        for(i=0;i<platformCount;i++){
            let platformGap=550/platformCount;
            let newPlatformBottom=50+i*platformGap;
            let newPlatform=new Platform(newPlatformBottom);
            platforms.push(newPlatform);
            console.log(platforms);
        }
    }

    //creating doodler
        function createDoodler(){
            grid.appendChild(doodler);
            doodler.classList+=' doodler';
            doodler.style.bottom=doodlerBottomSpacing+'px';
            doodlerLeftSpacing=platforms[0].left;
            doodler.style.left=doodlerLeftSpacing+'px';
        }

    //moving down the platforms
    function movePlatforms(){
        if(doodlerBottomSpacing>200){
            platforms.forEach(platform => {
                platform.bottom-=platformSpeed;
                let visual=platform.visual;
                visual.style.bottom=platform.bottom+'px';  
                if(platform.bottom<10){
                    let firstPlatform=platforms[0].visual;
                    score++;
                    if(typeof(score)=='number'){
                        document.getElementById('livescorejs').innerHTML=score;
                    }
                    if(typeof(level)=='number'){
                        document.getElementById('leveljs').innerHTML=level;
                    }
                    level=Math.floor((score/15));
                    console.log(level);
                    
                    if(score<49) platformSpeed=platformLevel[level];
                    firstPlatform.classList.remove('platform');
                    platforms.shift()
                    let newPlatform=new Platform(550);
                    platforms.push(newPlatform);
                }            
            });
        }
    }


    //function to jump
    function jump(){
        clearInterval(downTimerId);
        isJumping=true;
        upTimerId=setInterval(() => {
            doodlerBottomSpacing+=jumpSpeed[level];
            doodler.style.bottom=doodlerBottomSpacing+'px';
            if(doodlerBottomSpacing>startPoint+200) 
                fall()
        }, 20);
    } 


    //FALLING FUNCTION
    function fall(){
        clearInterval(upTimerId);
        isJumping=false;
        downTimerId=setInterval(() => {
            doodlerBottomSpacing-=fallSpeed[level];
            doodler.style.bottom=doodlerBottomSpacing+ 'px';
            if(doodlerBottomSpacing<0){
                gameOver();
                return;
            }
            console.log(doodlerBottomSpacing)
            platforms.forEach(platform=>{
                if(
                    (doodlerBottomSpacing>=platform.bottom)&&
                    (doodlerBottomSpacing<=platform.bottom+15)&&
                    (doodlerLeftSpacing+60>=platform.left)&&(doodlerLeftSpacing<=platform.left+85)&&
                    (!isJumping)
                ){
                    startPoint=doodlerBottomSpacing
                    jump();
                    
                }
            })
        }, 20);
        
        
    }
    if(width<500){
        document.querySelector('#mobileControls').classList.remove('hidden')
    }

    //GAMEOVER FUNCTION
    function gameOver(){
        isGameOver=true;
       
        
        clearInterval(downTimerId);
        clearInterval(upTimerId);
        clearInterval(goingLeft);
        clearInterval(goingRight);
        if(highscore===undefined){
            highscore=score;
        }else if(highscore<score){
            highscore=score;
        }
        document.getElementById('Score').innerHTML+=`   ${score}`;
        document.getElementById('HighScore').innerHTML+=`   ${highscore}`;
        toggle()
        localStorage.setItem('highscore',highscore); 
        
    }
    start()       
});




