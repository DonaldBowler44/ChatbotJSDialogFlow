import { Card } from '@mui/material';

function CardComp(props) {
    return (
        <Card
            style={{ width: 300 }}
            cover={
                <img
                    alt={props.cardInfo.fields.description.stringValue}
                    src={props.cardInfo.fields.imagestringValue} />
            }
            actions={[
                <a target="_blank" rel="nooopener noreferrer" href={props.cardInfo.fields.link.stringValue}>
                    <Icon type="ellipsis" key="ellipsis" />
                </a>
            ]}
            >
            <Meta 
                title={props.cardInfo.fields.stack.stringValue}
                description={props.cardInfo.fields.description.stringValue}
             />

        </Card>
    )
}

export default CardComp;