import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import Home from './pages/home'
import New from './pages/new'
import editAdd from './pages/editAdd'

export default createAppContainer(
    createSwitchNavigator({
        Home,
        New,
        editAdd,
    })
    ) 
// New
