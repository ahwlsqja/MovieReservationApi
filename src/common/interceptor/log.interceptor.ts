import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, map, tap } from "rxjs";

@Injectable()
export class LogInterceptor implements NestInterceptor{
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any>{
        /**
         * 요청이 들어올때 REQ 요청이 들어온 타임스탬프를 찍는다.
         * [REQ] { 요청 path }  {요청 시간}
         * 
         * 요청이 끝날때 (응답이 나갈떄)
         * [REQ] {요청 path} { 응답시간} {얼마나 걸렸는지 ms}
         */
        const req = context.switchToHttp().getRequest();

        // /shows
        // /common/image
        const path = req.originalUrl;

        const now = new Date();
        // * [REQ] { 요청 path }  {요청 시간} // 여기까지는 함수의 로직이 실행되기 전에 된다.
        console.log(`[REQ] ${path} ${now.toLocaleString('kr')}`)

        // return next.handle()을 실행하는 순간
        // 라우트의 로직이 전부 실행되고 응답이 반환된다.
        // observable(일종의 stream)로 
        return next
            .handle()  // 이때 응답이 반환된다.
            .pipe(
                tap(), // 모니터링
                tap(),
                tap(
                    (observable) => console.log(`[RES] ${path} ${new Date().toLocaleString('kr')} ${new Date().getMilliseconds() - now.getMilliseconds()}ms`),
                ),
                // 변형은 map
            );

    }
}