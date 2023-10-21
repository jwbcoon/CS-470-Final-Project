import EditEase from './pages/EditEase';
import './App.css'

// Note: console.log(JSON.stringify(data)) will always return empty even when data is there.
// Specify a key name like "name" within a file object and the data will present itself.
// https://stackoverflow.com/questions/11573710/event-datatransfer-files-is-empty-when-ondrop-is-fired

const App = props => {
	return (
		<div className='layout'>
        <EditEase/>
		</div>
	);
}

export default App;
