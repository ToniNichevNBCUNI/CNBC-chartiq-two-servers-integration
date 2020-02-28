import Loadable from 'react-loadable';
import Loading from '../../../components/Loading';
/* Components */
const Header = Loadable({
  loader: () => import ('../../../components/Header'),
  loading: Loading
});
const Home = Loadable({
  loader: () => import ('../../../components/Home'),
  loading: Loading
});
const ChartPage = Loadable({
  loader: () => import ('../../../components/ChartPage'),
  loading: Loading
});
const About = Loadable({
  loader: () => import ('../../../components/About'),
  loading: Loading
});
const Greetings = Loadable({
  loader: () => import ('../../../components/Greetings'),
  loading: Loading
});
export default {
  Home,
  About,
  Greetings,
  ChartPage,
  Header
}
