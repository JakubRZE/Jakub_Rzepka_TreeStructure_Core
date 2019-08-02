using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Jakub_Rzepka_TreeStructure_Core.DAL;
using Jakub_Rzepka_TreeStructure_Core.Models;
using Jakub_Rzepka_TreeStructure_Core.ViewModels;

namespace Jakub_Rzepka_TreeStructure_Core.Repositories
{
    public class NodeRepository : INodeRepository
    {
        private readonly AppDbContext _appDbContext;

        public NodeRepository(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        public List<HomeVM> GetAllNodes()
        {
            var nodes = _appDbContext.Nodes.Select(n => new HomeVM
            {
                Id = n.Id,
                Name = n.Name,
                ParentNodeId = n.ParentNodeId

            }).OrderBy(n => n.ParentNodeId).ToList();

            return nodes;
        }
    }
}
