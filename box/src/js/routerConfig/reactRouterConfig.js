//import rootRoute from './rootRouteConfig';
import ViewContainer from '../containers/ViewContainer';
import store, { injectAsyncReducer } from '../stores/Store';
import Root from '../containers/Root.js';
import personalWorkPanel from '../views/personalWorkPanel/PersonalWorkPanelComponent';
import ErrorPage from '../views/errorPage/ErrorPage';

function lazyLoadComponent(lazyModule, reducerName, lazyReducer) {
    return (location, cb) => {
        lazyReducer(reducer => {
            injectAsyncReducer(
                store,
                reducerName,
                reducer
            );
            lazyModule(module => {
                cb(null, module);
            });
        });

    }
}

function makeReactRouterConfig(rootConfig) {
    let reactRouterConfig = [];
    function traverseRouterMakeConfig(router, reactConfigArray) {
        router.forEach(oneRouter => {
            if (!oneRouter.children) {
                reactConfigArray.push({
                    path: oneRouter.path,
                    getComponent: lazyLoadComponent(
                        oneRouter.indexComponent,
                        oneRouter.reducerName,
                        oneRouter.viewReducer
                    )}
                );
            } else {
                let childRoutes = [];
                reactConfigArray.push({
                    path: oneRouter.path,
                    childRoutes,
                });
                traverseRouterMakeConfig(oneRouter.children, childRoutes);
            }
        });
    }
    traverseRouterMakeConfig(rootConfig, reactRouterConfig);

    reactRouterConfig.push(
        {
            path: '/error',
            component: ErrorPage,
        },
        {
            path: '*',
            component: ErrorPage,
            onEnter: ({ params }, replace) => replace('/error'),
        }
    );
    return reactRouterConfig;
}

const reactRouterConfig = {
    path: '/',
    component: Root,
    indexRoute: {
        component: personalWorkPanel
    },
    childRoutes: makeReactRouterConfig(rootRoute)
};

export default reactRouterConfig;
