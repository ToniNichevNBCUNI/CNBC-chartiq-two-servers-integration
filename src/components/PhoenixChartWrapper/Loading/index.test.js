import Loading from '.';

describe('Loading component', () => {
  it('should render default loading component', () => {
    const tree = getSnapshot(<Loading />);
    expect(tree).toMatchSnapshot();
  });

  it('should render night mode loading component', () => {
    const queryParams = {
      theme: 'night'
    };
    const tree = getSnapshot(<Loading queryParams={queryParams} />);
    expect(tree).toMatchSnapshot();
  });
});
