using Jakub_Rzepka_TreeStructure_Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Jakub_Rzepka_TreeStructure_Core.Repositories
{
    public interface INodeRepository
    {
        IEnumerable<Node> GetAllNodes();
    }
}
