import { ROUTES } from '@angular/router';
import {
  SystemJsNgModuleLoader, NgModuleFactory, Injector,
  SystemJsNgModuleLoaderConfig, Optional, Compiler, Injectable, Inject, forwardRef
} from '@angular/core';
import { LocalizeParser } from './localize-router.parser';

/**
 * Extension of SystemJsNgModuleLoader to enable localization of route on lazy load
 */
@Injectable()
export class LocalizeRouterConfigLoader extends SystemJsNgModuleLoader {

  constructor(@Inject(forwardRef(() => LocalizeParser)) private localize: LocalizeParser, _compiler: Compiler, @Optional() config?: SystemJsNgModuleLoaderConfig) {
    super(_compiler, config);
  }

  /**
   * Extend load with custom functionality
   * @param {string} path
   * @returns {Promise<NgModuleFactory<any>>}
   */
  load(path: string): Promise<NgModuleFactory<any>> {
    return super.load(path).then((factory: NgModuleFactory<any>) => {
      return {
        moduleType: factory.moduleType,
        create: (parentInjector: Injector) => {
          const module = factory.create(parentInjector);
          const getMethod = module.injector.get.bind(module.injector);

          module.injector['get'] = (token: any) => {
            const getResult = getMethod(token);

            if (token === ROUTES) {
              // translate lazy routes
              return this.localize.initChildRoutes([].concat(...getResult));
            } else {
              return getResult;
            }
          };
          return module;
        }
      };
    });
  }
}
