import { ReactNode } from 'react';
import { Container } from '@mui/material';

type Props = { children: ReactNode };

const Layout = ({ children }: Props) => {
  return (
    <Container
        sx={{
            width: 820,
            mt: 6,
            bgcolor: "background.paper",
            boxShadow: 1,
            borderRadius: 2,
            p: 2,
        }}
    >
        {children}
    </Container>
  )
};

export default Layout;