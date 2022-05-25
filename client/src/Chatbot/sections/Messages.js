import { List, Avatar, Icon } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import LocalPrintshopIcon from '@mui/icons-material/LocalPrintshop';

function Message(props) {

    const AvatarSrc = props.who === 'bot' ? <LocalPrintshopIcon /> : <LocalPrintshopIcon />

    return (
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        <ListItem alignItems="flex-start">
        <ListItemAvatar>
            <Avatar>
                {AvatarSrc}
            </Avatar>

        </ListItemAvatar>
        title={props.who}
        description={props.text}

        </ListItem>

        </List>
    )
}

export default Message;