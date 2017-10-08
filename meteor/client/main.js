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

Session.set('coins',0); aframe = require('aframe');
// require('aframe-slideshow-component');

Template.client.onRendered(function () {
  var instance = this;

  instance.autorun(function () {
    if(aframe){
      aframe.registerComponent('cursor-listener', {
        init: function () {
          var lastIndex = -1;
          this.el.addEventListener('click', function (evt) {
            if(evt.target.id.search('tree')){
              document.getElementById('tree'+evt.target.id).setAttribute('src', '#tree');
            } else {
              document.getElementById(evt.target.id).setAttribute('src', null);
              var coins = Session.get('coins')+3; Session.set('coins',coins);
            }
          });
          this.el.addEventListener('mouseenter', function (evt) { });

          this.el.addEventListener('mouseexit', function (evt) { });
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
        var plot = { x: x, z: z, i: increment, x2: x-(increment/2), z2: z+(increment/2) };
        list.push(plot);
      } z+=increment; x = 0;
    }

    return list;
  },
}); 

Template.gui.helpers({
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