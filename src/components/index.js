import appHeader from './header'
import appLeft from './left'

const Components = {
    install: function(Vue){
        Vue.component('app-header',appHeader),
        Vue.component('app-left',appLeft)
    }
}
export default Components