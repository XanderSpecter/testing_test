import styled from 'styled-components';
import { WithCommonStyles } from '../../types';

const Section = styled.section<WithCommonStyles>`
    position: relative;

    ${(props) => props.customStyles && { ...props.customStyles }}
`;

export default Section;
