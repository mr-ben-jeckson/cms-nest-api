import { Injectable, NestMiddleware } from '@nestjs/common';
import * as serveStatic from 'serve-static';
import * as path from 'path';

@Injectable()
export class StaticFileMiddleware implements NestMiddleware {
    use(req: any, res: any, next: () => void) {
        const staticPath = path.join(__dirname, '..', '..', '..', 'storage');
        serveStatic(staticPath)(req, res, next);
    }
}
