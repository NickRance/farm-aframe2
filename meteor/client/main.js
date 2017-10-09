/*
1. start with empty plot of land
2. user is given a level 1 farm house, and 1 farmer
3. user has a limited # of coins
4. coins are used to pay farmer to 'prepare soil'
5. coins are used to purchase seeds on the market
6. coins are used to pay farmer to 'plan seeds in prepared soil'
7. time elapses and plants grow from seeds planted in soil
8. when a plant matures, 
  8a. the farmer is instructed to harvest plant, which earns user coins
  8b. too much time passes and the plant rots
*/
aframe = require('aframe');

Session.set('coins',0); Session.set('second',0); Session.set('minute',0); 
Session.set('house','house'); Session.set('animation',false);
Session.set('tree',[]);

Template.client.onRendered(function () {
  gameclock();
  var instance = this;

  instance.autorun(function () {
    if(aframe){
      aframe.registerComponent('cursor-listener', {
        init: function () {
          var lastIndex = -1;

          this.el.addEventListener('click', function (evt) {
            console.log(evt);
            if(evt.target.id.search('tree')){
              snoopmove(evt.target.id);
            } else if(evt.target.id.search('house')){
                  document.getElementById('house').setAttribute('src', '#mansion');
              }
            else {
              document.getElementById(evt.target.id).setAttribute('src', null);
              var coins = Session.get('coins')+3; Session.set('coins',coins);
            }

          });
          this.el.addEventListener('mouseenter', function (evt) {
            document.getElementById(evt.target.id).setAttribute('opacity', '0.4');
            document.getElementById(evt.target.id).setAttribute('color', 'green');
          });

          this.el.addEventListener('mouseleave', function (evt) {
            document.getElementById(evt.target.id).setAttribute('opacity', '1');
            document.getElementById(evt.target.id).setAttribute('color', null);
          });

        }
      });
    }
  });  
});

Template.scene.helpers({
  plots : function () {
    var list = []; var increment = 3; var x = 0; var z = 0; var count = increment*10;

    while(z <= count){
      while(x <= count){
        x+=increment;
        var plot = { x: x-5, z: -z, i: increment, x2: x-(increment/2)-5, z2: -z+(increment/2) };
        list.push(plot);
      } z+=increment; x = 0;
    }

    return list;
  },
  animation : function () {
    if(Session.get('animation')){ return Session.get('animation'); }
    else { return null; }
  },
}); 

Template.gui.helpers({
  time : function () {
    if(Session.get('minute')) { return Session.get('minute') + ':' + Session.get('second'); }
    else { return Session.get('second'); }
  },
  coins : function () {
    return Session.get('coins');
  },
  selectdigsoil : function () {
    if(Session.get('selectdigsoil')){ return true; }
    else { return false; }
  },
  selectplant : function () {
    if(Session.get('selectplant')){ return true; }
    else { return false; }
  },
  selectharvest : function () {
    if(Session.get('selectharvest')){ return true; }
    else { return false; }
  },
}); 

Template.gui.events({
  'click #placedirt': function (e,t) {
    $(e.currentTarget).transition({animation  : 'pulse',});
    Session.set('selectdigsoil',true); Session.set('selectplant',false); Session.set('selectharvest',false);
  },
  'click #placeseed': function (e,t) {
    $(e.currentTarget).transition({animation  : 'pulse',});
    Session.set('selectdigsoil',false); Session.set('selectplant',true); Session.set('selectharvest',false);
  },
  'click #harvestplot': function (e,t) {
    $(e.currentTarget).transition({animation  : 'pulse',});
    Session.set('selectdigsoil',false); Session.set('selectplant',false); Session.set('selectharvest',true);
  },
}); 

function gameclock() {
  var second = Session.get('second');
  var minute = Session.get('minute');
  second = second+1; 
  if(second > 59){ second = 0; minute = minute+1; }
  Session.set('second',second); 
  Session.set('minute',minute); 
  Meteor.setTimeout(function(){ gameclock(); },1000);
}

function snoopmove(landid) {
  
  var snoop = document.getElementById('snoop');
  var land = document.getElementById(landid);
  
  var landx = landid.substring(0,land.id.search(','));
  var landz = landid.substring(land.id.search(',')+1);

  var animation = {
    property: 'position',
    duration: 4000,
    from: snoop.object3D.position.x + ' ' + snoop.object3D.position.y + ' ' + snoop.object3D.position.z,
    to: landx + ' ' + land.object3D.position.y + ' ' + landz,
  }

  if (landid == "-2,-30"){
    if(session.get('coins')>=3){
      document.getElementById('house').setAttribute('src', '#mars_base');
  }}

  Session.set('animation',animation);

  Meteor.setTimeout(function(){
    if (document.getElementById('tree'+landid).getAttribute('src')!='#tree'){
        document.getElementById('tree'+landid).setAttribute('src', '#tree');
    }
    else{
        document.getElementById('tree'+landid).setAttribute('src', '');
    }
      Session.set('animation',null);
  },animation.duration);
}