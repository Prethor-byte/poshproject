import { render } from '@testing-library/react';

function Dummy() { return <div>Test</div>; }

test('renders', () => {
  render(<Dummy />);
});
