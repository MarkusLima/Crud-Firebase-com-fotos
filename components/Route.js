import {createStackNavigator} from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import BoardScreen from './Board';
import BoardDetailScreen from './Detail';
import AddBoardScreen from './add';
import EditBoardScreen from './Edit';

const AppNavigator = createStackNavigator({
    Board: BoardScreen,
    BoardDetails: BoardDetailScreen,
    AddBoard: AddBoardScreen,
    EditBoard: EditBoardScreen,
  },
  {
    initialRouteName: 'Board',
  }
);

export default createAppContainer(AppNavigator);