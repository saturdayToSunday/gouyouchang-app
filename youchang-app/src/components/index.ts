
import MainLayout from './MainLayout.vue'
import BlankLayout from './BlankLayout.vue'
function MyPlugin(App:any){
    App.component('MainLayout',MainLayout);
    App.component('BlankLayout',BlankLayout)
}
export default MyPlugin;
