Router.configure({ layoutTemplate: 'client' });
Router.onBeforeAction(function () { this.next(); });
Router.onAfterAction(function () { var route = Router.current().route.getName(); });
Router.map(function() { this.route('home', { path: '/', }); });
