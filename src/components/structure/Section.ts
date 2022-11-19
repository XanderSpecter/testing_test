import styled from 'styled-components';
import { WithCommonStyles } from '../../types';

const Section = styled.section<WithCommonStyles>`
    position: relative;

    ${(props) => props.styles && { ...props.styles }}
`;

export default Section;
