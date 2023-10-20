import './App.css';
import DropZone from './components/DropZone';
import SideNav from './components/SideNav.js';

// Note: console.log(JSON.stringify(data)) will always return empty even when data is there.
// Specify a key name like "name" within a file object and the data will present itself.
// https://stackoverflow.com/questions/11573710/event-datatransfer-files-is-empty-when-ondrop-is-fired
const handleFiles = data => console.log(`handling files! ${JSON.stringify(data[0].name)}`);

const App = props => {
	return (
		<div className='layout'>
        <SideNav className='sidenav' style={{ backgroundColor: '#fafafa', width: '50px', height: '100%' }}/>
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'row' }}>
            <p flex={4}>Hello, World!</p>
            <DropZone className='dropzone' handleFiles={handleFiles}/>
        </div>
		</div>
	);
}

export default App;
