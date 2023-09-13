let w = c.width = window.innerWidth,
    h = c.height = window.innerHeight,
    ctx = c.getContext( '2d' ),
    
    particles = [],
    minSquareDist = w * 10,
    springConst = 0.000125,
    tick = 0;

for( let i = 0; i < 80; ++i )
  particles.push( new Particle );

function Particle(){
  
  this.x = Math.random() * w;
  this.y = Math.random() * h;
  
  let rad = Math.random() * Math.PI * 2;
  
  this.vx = Math.cos( rad ) * 2;
  this.vy = Math.sin( rad ) * 2;
  
  this.waveSize = rad;
}
Particle.prototype.update = function(){
  
  this.x += this.vx;
  this.y += this.vy;
  
  let changeX = true,
      changeY = true;
  
  if( this.x < 0 )
    this.x = 0;
  else if( this.x > w )
    this.x = w;
  else changeX = false;
  
  if( changeX )
    this.vx *= -1;
  
  if( this.y < 0 )
    this.y = 0;
  else if( this.y > h )
    this.y = h;
  else changeY = false;
  
  if( changeY )
    this.vy *= -1;
  
  this.waveSize += .1 + Math.random() * .001;
}
Particle.prototype.render = function(){
  
  ctx.fillStyle = '#7ed7fc'

  ctx.beginPath();
  ctx.arc( this.x, this.y, 5 + 2 * Math.sin( this.waveSize ), 0, Math.PI * 2 );
  ctx.fill();
}

function anim(){
  
  window.requestAnimationFrame( anim );
  
  ++tick;
  
  ctx.fillStyle = 'rgba(255,255,255,1)';
  ctx.fillRect( 0, 0, w, h );
  
  ctx.strokeStyle = 'rgba(0,0,0,.1)';
  
  particles.map( function( particle ){ particle.update(); } );
  
  for( let i = 0; i < particles.length; ++i ){
    
    let p1 = particles[ i ];
    
    for( let j = i + 1; j < particles.length; ++j ){
      
      let p2 = particles[ j ],
          dx = p1.x - p2.x,
          dy = p1.y - p2.y,
          dSquare = dx*dx + dy*dy;
      
      if( dSquare < minSquareDist ){
        
        p1.vx -= dx * springConst;
        p1.vy -= dy * springConst;
        p2.vx += dx * springConst;
        p2.vy += dy * springConst;
        
        ctx.lineWidth = ( 1 - dSquare / minSquareDist ) * 2;
        
        ctx.beginPath();
        ctx.moveTo( p1.x, p1.y );
        ctx.lineTo( p2.x, p2.y );
        ctx.stroke();
      }
    }
    
    p1.render();
  }
}
anim();

window.addEventListener( 'resize', function(){
  
  w = c.width = window.innerWidth;
  h = c.height = window.innerHeight;
  
  minSquareDist = w * 10;
})