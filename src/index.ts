class Main {
  constructor() {}

  start = () => {
    const toolRepository = new ToolRepositoryImple();
    const toolService = new ToolService(toolRepository);
    const toolController = new ToolController(toolService);
  };
}
