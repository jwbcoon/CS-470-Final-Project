import DropZone from '../components/DropZone';
import SideNav from '../menu/SideNav';

// Note: console.log(JSON.stringify(data)) will always return empty even when data is there.
// Specify a key name like "name" within a file object and the data will present itself.
// https://stackoverflow.com/questions/11573710/event-datatransfer-files-is-empty-when-ondrop-is-fired
const handleFiles = data => console.log(`handling files! ${JSON.stringify(data[0].name)}`);

const EditEase = props => {
	return (
		<div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
        <SideNav/>
        <div style={{ width: '100vw', height: '100%', position: 'absolute', top: '25%', left: 0, transform: 'translateX(25%)' }}>
            <DropZone handleFiles={handleFiles}/>
        </div>
		</div>
	);
}

export default EditEase;
