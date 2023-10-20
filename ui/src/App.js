import './App.css';
import DropZone from './components/DropZone';

// Note: console.log(JSON.stringify(data)) will always return empty even when data is there.
// Specify a key name like "name" within a file object and the data will present itself.
// https://stackoverflow.com/questions/11573710/event-datatransfer-files-is-empty-when-ondrop-is-fired
const handleFiles = data => console.log(`handling files! ${JSON.stringify(data[0].name)}`);

const App = props => {
	return (
		<div className='layout'>
        <p flex={4}>Hello, World!</p>
        <DropZone className='dropzone' handleFiles={handleFiles}/>
		</div>
	);
}

export default App;
