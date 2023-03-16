
var winWidth = window.innerWidth;
var winHeight = window.innerHeight;
var canvasWidth = winWidth*0.9
var canvasHeight = winHeight*0.9

class Player
{
    constructor(posX, posY,width, setHP )
    {
        this.x = posX;
        this.y = posY; 
        this.width = width
        this.isgrounded = false; 
        this.speed = 250;
        this.velocityVec = {x:0,y:0}
        this.rotation = 0 // 0: up, 1: right, 2: down, 3: left
        this.rotDir = 0 // 0: none, 1: right, 2: left 
        this.angle = 0
        this.setFireCooldown = 0.2;
        this.curFireCoolDown = 0;
        this.canFire = true; 
        this.bulDmg = 10

        this.setDashCD = 4
        this.curDashCD = 0
        this.canDash = true

        this.setHP = setHP
        this.curHP = setHP

        this.InvulTimerSet = 1
        this.curInvulTimer = 0
        this.canTakeDmg = true; 
    }

    render()
    {
        
        rectMode(CENTER)
        

        if(this.rotDir == 1)
        {push();
            translate(this.x, this.y-this.width/4) 
            this.angle += PI/180
            rotate(this.angle*3)
            rect(0,0, this.width)
            pop()
        }
        else if(this.rotDir == 2)
        {push();
            translate(this.x-this.width/2, this.y-this.width/4)
            this.angle -= PI/180
            rotate(this.angle*3)
            rect(0,0, this.width)
            pop()
        }
        else
        {
            if(this.rotation == 0)
            {
                triangle(this.x, this.y -this.width/2- 20, this.x+this.width/4, this.y -this.width/2-10, this.x-this.width/4, this.y -this.width/2-10)
            }
            else if(this.rotation == 1)
            {
                triangle(this.x+this.width/2 + 20, this.y, this.x+this.width/2 + 10, this.y -this.width/4, this.x+this.width/2 + 10, this.y+this.width/4)
            }
            else if(this.rotation == 3)
            {
                triangle(this.x- 30, this.y, this.x- 20, this.y -this.width/4, this.x-20, this.y+this.width/4)
            }
            rectMode(CORNER)
            if(!this.canTakeDmg) stroke('rgba(0,0,0,0.5)')
            else stroke("rgba(0,0,0,1)")
            rect(this.x-this.width/2, this.y-this.width/2, this.width)
            stroke("rgba(0,0,0,1)")
        }

        rectMode(CORNER)
        rect(this.x-this.width/2-5, this.y+this.width+10,this.width+10, 15)
        console.log((this.curHP))
        rect(this.x-this.width/2-5, this.y+this.width+10,(this.width+10)*(this.curHP/this.setHP), 15)        
        
    }

    takeDamage(dmg)
    {
        if(!this.canTakeDmg) return
        this.curHP -= dmg
        this.curInvulTimer = 0
        this.canTakeDmg = false
    }

    heal(hp)
    {
        this.curHP += hp; 
        if(this.curHP > this.setHP)
        {
            this.curHP = this.setHP
        }
    }

    handleTimers()
    {
        if(!this.canFire)
        {
            this.curFireCoolDown +=deltaTime*0.001;
            if(this.curFireCoolDown >= this.setFireCooldown)
            {
                this.canFire = true;

            }
        }
        if(!this.canDash)
        {
            this.curDashCD +=deltaTime*0.001;
            if(this.curDashCD >= this.setDashCD)
            {
                this.canDash = true;

            }
        }
        if(!this.canTakeDmg)
        {
            this.curInvulTimer +=deltaTime*0.001;
            if(this.curInvulTimer >= this.InvulTimerSet)
            {
                this.canTakeDmg = true;

            }
        }
    }

    update()
    {
        this.handleTimers()
        let collide = false
        for(let i = 0; i < obstacles.length; i++)
        {
            if(collideRectRect(this.x-this.width/2, this.y-this.width/2, this.width, this.width, obstacles[i].x-obstacles[i].width/2,obstacles[i].y-obstacles[i].height/2,obstacles[i].width,obstacles[i].height))
            {
                this.isgrounded = true
                this.y = obstacles[i].y-this.width/2
                this.velocityVec.y = 0; 
                collide = true;
                this.rotDir = 0
                this.angle = 0
                rotate(0)
                break; 
            }        
        }
        if(!collide)
        {
            this.isgrounded = false 
        }
        var velX = 0
        if(keyIsDown(65))
        {
            this.velocityVec.x += -this.speed*(deltaTime*0.001); 
            this.x += this.velocityVec.x 
            
            velX+=this.velocityVec.x;

            this.velocityVec.x += this.speed*(deltaTime*0.001); 
        }
        if(keyIsDown(68))
        {
            this.velocityVec.x += this.speed*(deltaTime*0.001); 
            this.x += this.velocityVec.x 
            
            velX+=this.velocityVec.x 

            this.velocityVec.x -= this.speed*(deltaTime*0.001);
        }
        
        if(this.x-this.width/2 <= 0)
        {
            this.x = this.width/2 ;
        }
        else if(this.x >= canvasWidth-this.width/2)
        {
            this.x = canvasWidth-this.width/2
        }

        if(this.isgrounded == false)
        {
            this.velocityVec.y += -19.6*(deltaTime*0.001); 
        }
        if(keyIsDown(87) && this.isgrounded)
        {
            this.velocityVec.y = 8
            if(velX > 0)
            {
                this.rotDir = 1
                this.rotate(1)
            }
            else if(velX < 0)
            {
                this.rotDir = 2 
                this.rotate(2)
            }
            
        }
        //shoot
        if(keyIsDown(32) && this.canFire )
        {
            if(this.rotation==0)
            {
                bullets.push(new Bullet(this.x, this.y-this.width,10, 0, this.bulDmg))
            }
            if(this.rotation == 1)
            {   
                bullets.push(new Bullet(this.x+this.width, this.y,10, 1, this.bulDmg))
            }
            if(this.rotation == 3)
            {   
                bullets.push(new Bullet(this.x, this.y,10, 2, this.bulDmg ))
            }
            this.canFire = false 
            this.curFireCoolDown = 0
        }
        if(keyIsDown(16) && this.canDash)
        {
            if(velX>0)
            {
                this.x+= canvasWidth*0.2;
                this.curDashCD = 0
                this.canDash = false
            }
            else if(velX<0)
            {
                this.x-= canvasWidth*0.2;
                this.curDashCD = 0
                this.canDash = false
            }
        }
        if(this.canDash)
        {
            document.getElementById("dashStatus").innerHTML = "Dash Cooldown (Lshift): Ready!"
        }
        else 
        {
            document.getElementById("dashStatus").innerHTML = `Dash Cooldown (Lshift): ${(this.setDashCD-this.curDashCD).toFixed(1)}`
        }


        this.y -= this.velocityVec.y
    }


    rotate(dir)
    {
        if(dir == 1)
        {
            this.rotation = this.rotation + 1; 
            if(this.rotation >3) this.rotation = 0
        }
        else if(dir==2)
        {

            this.rotation= this.rotation - 1;; 
            if(this.rotation <0) this.rotation = 3
        }
    }
}

class Bullet
{
    constructor(posX, posY, radius, dir,dmg)
    {
        this.x = posX
        this.y = posY
        this.radius = radius
        this.dir = dir // 0: up, 1: right, 2:left
        this.speed = 1250
        this.dmg = dmg
    }

    update()
    {
        if(this.dir == 0 )
        {
            this.y -= this.speed*deltaTime*0.001; 
        }
        else if(this.dir == 1)
        {

            this.x += this.speed*deltaTime*0.001; 
        }
        else 
        {
            this.x -= this.speed*deltaTime*0.001; 
        }

        if(this.x <= 0 || this.x >= canvasWidth || this.y <= 0 || this.y >= canvasHeight)
        {
            return true; 
        }
        if(collideRectCircle( boss.x,boss.y,boss.width,boss.height,this.x, this.y, this.radius))
        {
            boss.damage(25   )
            return true
        }

        var i = 0
        while(i < bossWeakness.length)
        {
            if(collideRectCircle( bossWeakness[i].x-bossWeakness[i].width/2,bossWeakness[i].y-bossWeakness[i].height,bossWeakness[i].width,bossWeakness[i].height,this.x, this.y, this.radius))
            {
                bossWeakness[i].damage(this.dmg)
                return true
            }
            i++
        }
        return false;
    }

    render()
    {
        circle(this.x, this.y, this.radius)
    }
}

class BossTriBeamBullet
{
    constructor(posX, posY, radius, angle )
    {
        this.x = posX
        this.y = posY
        this.radius = radius
        this.angle = angle
        //console.log(angle)
        this.speed = 750
    }

    update()
    {
        this.x -= sin(this.angle)*this.speed*deltaTime*0.001 
        this.y -= cos(this.angle)*this.speed*deltaTime*0.001

        if(collideRectCircle( player.x,player.y-player.width/2,player.width,player.width,this.x, this.y, this.radius))
        {
            player.takeDamage(50)
            return true
        }
        if(this.x <= 0 || this.x >= canvasWidth || this.y <= 0 || this.y >= canvasHeight)
        {
            return true; 
        }
        return false

    }

    render()
    {
        circle(this.x, this.y, this.radius)
    }
}

class BossMissiles
{
    constructor(posX, posY, radius, angle)
    {
        this.x = posX
        this.y = posY
        this.radius = radius
        this.angle = angle
        //console.log(angle)
        this.speed = 600
        this.targetting = true; 
    }
    update()
    {
        this.x -= sin(this.angle)*this.speed*deltaTime*0.001 
        this.y -= cos(this.angle)*this.speed*deltaTime*0.001

        if(dist(this.x,this.y, player.x,player.y+player.width/2) > canvasHeight*0.2 && this.targetting)
        {
            this.angle = atan2(this.x - player.x,this.y - player.y+player.width/2 )
        }
        else 
        {
            this.targetting = false 
        }
        if(collideRectCircle( player.x,player.y-player.width/2,player.width,player.width,this.x, this.y, this.radius))
        {
            player.takeDamage(75)
            return true
        }
        if(this.x <= 0 || this.x >= canvasWidth || this.y <= 0 || this.y >= canvasHeight)
        {
            return true; 
        }
        return false

    }

    render()
    {
        //make a triangle later 
        circle(this.x, this.y, this.radius)
    }
}

class BossLaser
{
    constructor(posX, posY)
    {
        this.x = posX
        this.y = posY
        this.height = canvasHeight
        this.width = canvasWidth*0.1

        this.setTimer = 0.6
        this.curTimer = 0 
    } 

    update()
    {
        if(this.curTimer >= this.setTimer)
        {
            return true
        }
        if(collideRectRect( player.x,player.y-player.width/2,player.width,player.width,this.x-this.width/2, this.y-this.height/2, this.width, this.height))
        {
            player.takeDamage(125)
        }
        this.curTimer+= deltaTime*0.001
        return false
    }

    render()
    {
        rect(this.x-this.width/2, this.y, this.width, this.height)
    }
}

class Boss
{
    constructor(posX, posY, width, height, setHP)
    {
        this.x = posX
        this.setX = this.x
        this.y = posY
        this.width = width
        this.height = height
        this.setAttackTimer = Math.random(1,4)
        this.curAttackTimer = 0
        this.state = 0; //0: chilling, 1: devious
        this.curAtkNum = 0;
        this.curSpecificAtkNum = 0; 
        this.midAttack = false;

        this.canAttk = true; 

        this.setSpecificAtkTimer = Math.random(0.5,2)
        this.curSpecificAtkTimer = 0

        this.setHP = setHP;
        this.curHp = setHP

        this.weaknessNum = 5;
        this.setWeaknessNum = 5;

        this.targetX;
        //0: triBeam //: missille //2 lazer  //3: sideCollapse 
        // this.attacks = {
        //     0: this.shootTriBullet()
        // }        
    }
    handleTimers()
    {
        if(!this.canAttk)
        {
            this.curSpecificAtkTimer+=deltaTime*0.001;
            if(this.curSpecificAtkTimer >= this.setSpecificAtkTimer)
            {
                this.canAttk = true;

            }
        }
    }
    shootTriBullet()
    {
        this.curSpecificAtkNum++ 
        for(let i = 0; i < 3; i++)
        {
            bossProjectiles.push(new BossTriBeamBullet(this.x+this.width/2,this.y +this.height,20,atan2(this.x+this.width/2 - player.x,this.y +this.height - player.y+player.width/2 )-(PI/180*10 *(-1+i))) )
        }
        this.setSpecificAtkTimer = 0.5
        if(this.curSpecificAtkNum == 8)
        {
            this.curAtkNum++ 
            this.curAtkNum = Math.floor(random(0,3))
            this.setSpecificAtkTimer = 1
            if(this.curAtkNum == 2) this.setSpecificAtkTimer =1.5
            this.curSpecificAtkNum = 0;
            this.targetX = player.x
        }
    }

    damage(dmg)
    {
        if(this.weaknessNum < 5)
        {
            this.curHp -= dmg*4;
            this.weaknessNum++
        } 
        else
        {
            this.curHp -= dmg;
        }
    }

    weaken()
    {
        this.weaknessNum = 0
    }

    triBulletIndicator()
    {
        line(this.x+this.width/2,this.y +this.height,player.x, player.y)
    }

    shootMissiles() 
    {
        this.curSpecificAtkNum++ 
        for(let i = 0; i < 2; i++)
        {
            bossProjectiles.push(new BossMissiles(this.x+this.width/2-this.width/4*(1-(i*2)),this.y +this.height,20,atan2(this.x+this.width/2 - player.x,this.y +this.height - player.y+player.width/2 )) )
        }
        this.setSpecificAtkTimer = 0.8
        if(this.curSpecificAtkNum == 4)
        {
            this.curAtkNum++ 
            this.curAtkNum = Math.floor(random(0,3))
            this.setSpecificAtkTimer = 1
            if(this.curAtkNum == 2) this.setSpecificAtkTimer =1.5
            this.curSpecificAtkNum = 0;
            this.targetX=player.x
        }
    }

    missileIndicator()
    {
        triangle(this.x+this.width/2-this.width/4,this.y +this.height+20,this.x+this.width/2-this.width/4-10,this.y +this.height+10, this.x+this.width/2-this.width/4+10,this.y +this.height+10 )

        triangle(this.x+this.width/2+this.width/4,this.y +this.height+20,this.x+this.width/2+this.width/4-10,this.y +this.height+10, this.x+this.width/2+this.width/4+10,this.y +this.height+10 )
    }

    fireLaser()
    {
        this.curSpecificAtkNum++ 
        bossProjectiles.push(new BossLaser(this.targetX, this.y +this.height))
        this.targetX=player.x
        this.setSpecificAtkTimer = 0.6
        if(this.curSpecificAtkNum == 4)
        {
            this.curAtkNum++ 
            this.curAtkNum = Math.floor(random(0,3))
            this.setSpecificAtkTimer = 1
            this.curSpecificAtkNum = 0;
            this.targetX=player.x
            this.x = this.setX
        }
    }

    indicateLaser()
    {
        this.x = this.targetX-this.width/2
        strokeWeight(5)
        line(this.targetX, this.y +this.height, this.targetX, ground.y)

        strokeWeight(1)
    }

    update()
    {
        if(this.state == 1)
        {
            this.handleTimers()
            if(this.curAtkNum==0)
            {
                if(this.canAttk)
                {
                    this.shootTriBullet()
                    this.curSpecificAtkTimer = 0
                    this.canAttk = false
                }
                else 
                {
                    this.triBulletIndicator()
                }
            }
            else if(this.curAtkNum == 1)
            {
                if(this.canAttk)
                {
                    this.shootMissiles()
                    this.curSpecificAtkTimer = 0
                    this.canAttk = false
                }
                else
                {
                    this.missileIndicator()
                }
            }
            else if(this.curAtkNum == 2)
            {
                if(this.canAttk)
                {
                    this.fireLaser()
                    this.curSpecificAtkTimer = 0
                    this.canAttk = false
                }
                else 
                {
                    this.indicateLaser()
                }
            }
        }
        else if(this.state == 0)
        {
            if(this.curAttackTimer >= this.setAttackTimer)
            {
                this.curAtkNum = 0; 
                if(this.curAtkNum == 0)
                {
                    this.setSpecificAtkTimer = 1
                }
                this.state = 1
                this.canAttk = false

            }
            else 
            {
                this.curAttackTimer += deltaTime*0.001
            }
        }
    }

    render()
    {
        rect(this.x, this.y, this.width, this.height)

        rect(this.x+this.width/8, this.y+this.height/8, this.x+this.width/2+this.width/8, this.y+this.height/8+20)
        rect(this.x+this.width/8, this.y+this.height/8, (this.x+this.width/2+this.width/8)*(this.curHp/this.setHP), this.y+this.height/8+20)
    }

    

}

class WeakPillars
{
    constructor(posX, posY, width, height,setHP)
    {
        this.x = posX
        this.y = posY
        this.width = width
        this.height = height
        this.setHP = setHP
        this.hp = setHP
    }

    update()
    {
        if(this.hp <= 0)
        {
            boss.damage(250)
            boss.weaken()
            player.heal(125)
            return true;
        }
        return false
    }

    damage(dmg)
    {
        this.hp -= dmg;
    } 

    render()
    {
        rect(this.x-this.width/2, this.y-this.height, this.width, this.height)

        rect(this.x-this.width/2, this.y+canvasHeight*0.025, this.width, canvasHeight*0.05)
        rect(this.x-this.width/2, this.y+canvasHeight*0.025, this.width *(this.hp/this.setHP), canvasHeight*0.05)
    }
}


class Obstacle
{
    constructor(posX, posY, width, height)
    {
        this.x = posX;
        this.y = posY; 
        this.width = width;
        this.height = height
    }

    render()
    {
        
        rect(this.x-this.width/2, this.y -this.height/2,this.width, this.height  )
    }
}


player = new Player(canvasWidth/2, canvasHeight*0.7,25,500  );

ground = new Obstacle(canvasWidth/2, canvasHeight *0.9, winWidth*0.9, 2) 

boss = new Boss(canvasWidth*0.1, 0,canvasWidth*0.8, canvasHeight*0.4,10000 )

const obstacles =[]

var gameState = 0 

const bullets = []

const bossProjectiles = []

const bossWeakness = []

var setWeaknessTimer;

var curWeaknessTimer = 0;

obstacles.push(ground)

//bossWeakness.push(new WeakPillars(200, ground.y, 50,125,100))

function setup()
{
    createCanvas(winWidth*0.9, winHeight*0.9)
    setWeaknessTimer = random(5,10)
}



function draw()
{
    if(gameState == 0)
    {
            clear();  

        curWeaknessTimer+= deltaTime*0.001
        if(curWeaknessTimer >= setWeaknessTimer && bossWeakness.length < 2)
        {
            bossWeakness.push(new WeakPillars(random(canvasWidth/8,canvasWidth-canvasWidth/8), ground.y, 50,125,100))
            setWeaknessTimer = random(5,10)
            curWeaknessTimer= 0
        }
        player.update();
        boss.update(); 
        for(let i = 0; i < obstacles.length; i++)
        {
            obstacles[i].render();
        }

        player.render()
        boss.render()

        var i = 0; 
        while(i < bullets.length)
        {
            var removeBul = bullets[i].update() 
            
            if(removeBul)
            {
                bullets.splice(i, 1)
            }
            else
            {
                bullets[i].render()
                i++
            }
            
        }

        i = 0; 
        while(i < bossProjectiles.length)
        {
            var removeBul = bossProjectiles[i].update() 
            
            if(removeBul)
            {
                bossProjectiles.splice(i, 1)
            }
            else
            {
                bossProjectiles[i].render()
                i++
            }
            
        }

        i = 0
        while(i < bossWeakness.length)
        {
            var removeBul = bossWeakness[i].update() 
            
            if(removeBul)
            {
                bossWeakness.splice(i, 1)
            }
            else
            {
                bossWeakness[i].render()
                i++
            }
        }
        if(player.curHP <= 0) gameState = 2
        else if(boss.curHp <= 0) gameState = 1

    }
    else if(gameState == 1)
    {
        if(document.getElementById("status").innerHTML != "YOU WIN!" )
        {
            document.getElementById("status").innerHTML = "YOU WIN!"
        }
    }
    else if(gameState == 2)
    {
        if(document.getElementById("status").innerHTML != "YOU LOSE!" )
        {
            document.getElementById("status").innerHTML = "YOU LOSE!"
        }
    }
    //console.log(deltaTime*0.001)
    
}