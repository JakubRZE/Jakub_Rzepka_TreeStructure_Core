using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Jakub_Rzepka_TreeStructure_Core.DAL;
using Jakub_Rzepka_TreeStructure_Core.Models;

namespace Jakub_Rzepka_TreeStructure_Core.Repositories
{
    public class NodeRepository : INodeRepository
    {
        private readonly AppDbContext _appDbContext;

        public NodeRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public IEnumerable<Node> GetAllNodes()
        {
            var nodes = _appDbContext.Nodes.ToList();
            return nodes;
        }
    }
}
