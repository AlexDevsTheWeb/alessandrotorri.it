
import { Slide, useScrollTrigger } from '@mui/material';

interface Props {
  children: React.ReactElement;
}

const NavbarWrapper = (props: Props) => {

  const { children } = props;

  // trigger sarà true quando l'utente scende (scroll down)
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export default NavbarWrapper
