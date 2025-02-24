import buildRoutes from 'ember-engines/routes';

export default buildRoutes(function() {
    this.route('index', { path: '/registries' });
    this.route('discover', { path: '/registries/discover' });

    this.route('start', { path: '/registries/start' });

    this.route('forms', { path: '/registries/forms' }, function() {
        this.route('help', { path: '/help' });
    });

    this.route('drafts', { path: '/registries/drafts' }, function() {
        this.route('draft-shim', { path: '/:id' });
        this.route('draft', { path: '/:id/:page' });
    });

    this.route('overview', { path: '/:guid' } as any, function() {
        this.route('analytics');
        this.route('children', { path: '/components' });
        this.route('comments');
        this.route('forks');
        this.route('links');
    });

    this.route('page-not-found', { path: '/*path' });
});
