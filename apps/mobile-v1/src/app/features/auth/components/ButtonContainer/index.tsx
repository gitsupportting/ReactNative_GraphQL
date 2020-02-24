import spacing from 'app/theme/spacing';
import View from 'lib/components/View';
import { styled } from 'lib/stylesheet';

const ButtonContainer = styled(View)`
    flex: 1;
    flex-basis: 1;
    flex-grow: 2;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    padding: ${spacing(5)}px;
`;

export default ButtonContainer;
