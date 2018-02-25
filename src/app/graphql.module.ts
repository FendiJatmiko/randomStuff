import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";

// Apollo Client implementation
import { ApolloModule, Apollo } from "apollo-angular";
import { HttpLinkModule, HttpLink } from "apollo-angular-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { setContext } from "apollo-link-context";
import { ApolloClient } from "apollo-client";
import { concat } from "apollo-link";

@NgModule({
    exports: [HttpClientModule, ApolloModule, HttpLinkModule]
})
//experimental Decorator 
export class GraphQLModule {
    constructor(apollo: Apollo, httpLink: HttpLink ) {

        const httpC = httpLink.create({
            uri: 'http://localhost:6060/login'
        });
     
        const auth = setContext((_, { headers }) => {
            const token = localStorage.getItem('token');
            if (!token){
                return {};
            }else {
                return {
                    headers: headers.append(!'Authorization', `Bearer ${token}`)
                };
            }
        });
        apollo.create({
            link: auth.concat(httpC),
            cache: new InMemoryCache()
        });

        const client = new ApolloClient({
            link: concat(auth, httpC)
        });
        // apollo.create({
        //     link: httpLink.create({ uri: 'http://localhost:6060/auth'}),
        //     cache: new InMemoryCache()
        // });
    }
}